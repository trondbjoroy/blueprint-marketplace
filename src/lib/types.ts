export type Category = 'DeFi' | 'Lending' | 'Staking' | 'Betting' | 'Gaming' | 'Governance' | 'NFT' | 'Other';

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
  status: 'Published';
  githubUrl?: string;
  versionHistory: {
    version: string;
    date: string;
    changes: string;
  }[];
}
