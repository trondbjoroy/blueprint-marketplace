export type Category = 'DeFi' | 'Lending' | 'Staking' | 'Betting' | 'Gaming' | 'Governance' | 'NFT' | 'Other';

export type BlueprintStatus = 'Approved' | 'Published' | 'In Review' | 'Pending';

export interface Blueprint {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  author: {
    name: string;
    avatar?: string;
    github?: string;
  };
  version: string;
  timestamp: string;
  category: Category;
  code: string;
  status: BlueprintStatus;
  githubIssueNumber?: number;
  githubUrl?: string;
  versionHistory: {
    version: string;
    date: string;
    changes: string;
  }[];
}

export interface GitHubProjectItem {
  id: string;
  title: string;
  status: string;
  issueNumber?: number;
  issueUrl?: string;
}
