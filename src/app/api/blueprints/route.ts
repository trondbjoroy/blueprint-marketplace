import { NextResponse } from 'next/server';
import { Blueprint, Category } from '@/lib/types';

const ORG = 'HathorNetwork';
const REPO = 'community-blueprints';

interface ProjectV2Item {
  id: string;
  fieldValueByName: {
    name: string;
  } | null;
  content: {
    __typename: string;
    number?: number;
    title?: string;
    body?: string;
    labels?: {
      nodes: { name: string }[];
    };
    author?: {
      login: string;
      avatarUrl?: string;
    };
    createdAt?: string;
    updatedAt?: string;
  } | null;
}


async function fetchProjectItems(): Promise<ProjectV2Item[]> {
  const allItems: ProjectV2Item[] = [];

  // Try REST API to fetch issues
  try {
    const restUrl = `https://api.github.com/repos/${ORG}/${REPO}/issues?state=all&per_page=100`;
    const restResponse = await fetch(restUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (restResponse.ok) {
      const issues = await restResponse.json();

      for (const issue of issues) {
        const title = issue.title?.toLowerCase() || '';
        const labels = issue.labels?.map((l: { name: string }) => l.name.toLowerCase()) || [];

        const isBlueprint = title.includes('blueprint') ||
                            title.includes('add ') ||
                            labels.includes('blueprint');

        if (isBlueprint) {
          allItems.push({
            id: String(issue.id),
            fieldValueByName: { name: 'Published' },
            content: {
              __typename: 'Issue',
              number: issue.number,
              title: issue.title,
              body: issue.body || '',
              labels: { nodes: issue.labels?.map((l: { name: string }) => ({ name: l.name })) || [] },
              author: {
                login: issue.user?.login || 'Anonymous',
                avatarUrl: issue.user?.avatar_url,
              },
              createdAt: issue.created_at,
              updatedAt: issue.updated_at,
            },
          });
        }
      }
    }
  } catch (error) {
    console.error('Error fetching blueprints:', error);
  }

  return allItems;
}

function parseCategory(labels: { name: string }[]): Category {
  const categoryMap: Record<string, Category> = {
    'defi': 'DeFi',
    'lending': 'Lending',
    'staking': 'Staking',
    'betting': 'Betting',
    'gaming': 'Gaming',
    'governance': 'Governance',
    'nft': 'NFT',
  };

  for (const label of labels) {
    const lower = label.name.toLowerCase();
    if (categoryMap[lower]) {
      return categoryMap[lower];
    }
  }
  return 'DeFi';
}

function parseVersion(body: string): string {
  const versionMatch = body.match(/version[:\s]+(\d+\.\d+\.\d+)/i);
  return versionMatch ? versionMatch[1] : '1.0.0';
}

function parseCodeBlock(body: string): string {
  const codeMatch = body.match(/```[\w]*\n([\s\S]*?)```/);
  return codeMatch ? codeMatch[1].trim() : '// No code preview available';
}

const NAME_OVERRIDES: Record<number, string> = {
  4: 'OTC Escrow Swap',
  3: 'Oasis - Liquidity Incentives',
  2: 'Dozer Pool Manager',
};

const DESCRIPTION_OVERRIDES: Record<number, string> = {
  4: 'OTC Escrow Swap Blueprint',
  3: 'Liquidity Incentive Protocol',
  2: 'Multi-Pool AMM Blueprint',
};

const EXCLUDED_ISSUE_NUMBERS: number[] = [1, 5];

const STATIC_BLUEPRINTS: Blueprint[] = [
  {
    id: 'hathordice',
    name: 'Hathor Dice',
    description: 'A decentralized dice game on Hathor Network. Players choose their bet and a cap to win rewards based on the roll.',
    longDescription: 'Hathor Dice is a simple betting game inspired by the original SatoshiDice where players choose how much they want to bet and optionally a cap (which defines the odds and the reward). A die is rolled and if it is lower than the cap they win the reward, otherwise they lose the amount bet.\n\nBuilt with Hathor Nano Contracts for Bitcoin-grade security and MEV-proof execution.',
    author: {
      name: 'HathorNetwork',
      avatar: 'https://github.com/HathorNetwork.png',
      github: 'HathorNetwork',
    },
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'Gaming',
    code: `# Hathor Dice Nano Contract (Conceptual)
class DiceGame(NanoContract):
    def __init__(self, house_address):
        self.house = house_address
        self.min_bet = 100
        self.max_bet = 10000

    @public
    def bet(self, cap):
        # Validate bet amount and cap
        assert self.min_bet <= self.tx.value <= self.max_bet
        assert 1 <= cap <= 99

        # Roll the dice (conceptually)
        roll = self.get_random_number(1, 100)
        
        if roll < cap:
            # Player wins
            reward = self.tx.value * (100 / cap)
            self.transfer(self.tx.author, reward)
        else:
            # House wins
            self.transfer(self.house, self.tx.value)`,
    status: 'Published',
    githubUrl: 'https://github.com/HathorNetwork/hathor-dice',
    versionHistory: [
      {
        version: '1.0.0',
        date: '2025-11-19',
        changes: 'Initial release of Hathor Dice DApp',
      },
    ],
  }
];

function itemToBlueprint(item: ProjectV2Item): Blueprint | null {
  const content = item.content;
  if (!content || (content.__typename !== 'Issue' && content.__typename !== 'PullRequest')) return null;

  const body = content.body || '';
  const labels = content.labels?.nodes || [];
  const issueNumber = content.number || 0;

  return {
    id: String(content.number),
    name: NAME_OVERRIDES[issueNumber] || content.title || 'Untitled Blueprint',
    description: DESCRIPTION_OVERRIDES[issueNumber] || body.split('\n')[0]?.substring(0, 200) || 'No description provided.',
    longDescription: body,
    author: {
      name: content.author?.login || 'Anonymous',
      avatar: content.author?.avatarUrl,
      github: content.author?.login,
    },
    version: parseVersion(body),
    timestamp: content.createdAt || new Date().toISOString(),
    category: parseCategory(labels),
    code: parseCodeBlock(body),
    status: (item.fieldValueByName?.name as Blueprint['status']) || 'Pending',
    githubIssueNumber: content.number,
    versionHistory: [
      {
        version: parseVersion(body),
        date: content.updatedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
        changes: 'Latest submission',
      },
    ],
  };
}

export const revalidate = 0; // Force revalidation on every request

export async function GET() {
  try {
    const items = await fetchProjectItems();
    console.log(`Fetched ${items.length} total items from GitHub`);
    
    const approvedStatuses = ['Approved', 'Published'];
const blueprints = items
        .filter((item) => {
          const status = item.fieldValueByName?.name;
          const isApproved = status && approvedStatuses.includes(status);
          const issueNumber = item.content?.number;
          const isExcluded = issueNumber && EXCLUDED_ISSUE_NUMBERS.includes(issueNumber);
          if (isExcluded) console.log(`Item ${issueNumber} excluded from list`);
          else if (!isApproved) console.log(`Item ${item.content?.number} excluded due to status: ${status}`);
          return isApproved && !isExcluded;
        })
      .map((item) => {
        const bp = itemToBlueprint(item);
        if (!bp) console.log(`Item ${item.content?.number} failed to parse to blueprint`);
        return bp;
      })
      .filter((bp): bp is Blueprint => bp !== null);

    const allBlueprints = [...blueprints, ...STATIC_BLUEPRINTS].sort((a, b) => 
      a.name.localeCompare(b.name)
    );

    console.log(`Returning ${allBlueprints.length} blueprints`);
    return NextResponse.json(
      { blueprints: allBlueprints, total: allBlueprints.length },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          },
        }
    );
  } catch (error) {
    console.error('Error fetching blueprints:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blueprints', blueprints: STATIC_BLUEPRINTS },
      { status: 500 }
    );
  }
}
