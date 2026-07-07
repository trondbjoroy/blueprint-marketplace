'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, Copy, Check, Github, ArrowRight, ExternalLink, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Blueprint, Category } from '@/lib/types';

const CATEGORIES: Category[] = ['DeFi', 'Lending', 'Staking', 'Betting', 'Gaming', 'Governance', 'NFT', 'Other'];

const HARDCODED_BLUEPRINTS: Blueprint[] = [
  {
    id: 'pr-2',
    name: 'Dozer Pool Manager',
    description: 'Multi-Pool AMM singleton contract managing multiple Uniswap v2-style liquidity pools with multi-hop routing.',
    longDescription: `# Dozer Pool Manager Blueprint - Multi-Pool AMM

This blueprint implements **Dozer Pool Manager**, a singleton contract that manages multiple liquidity pools in a Uniswap v2-style automated market maker (AMM) for the Hathor network.

## What it does

Dozer Pool Manager enables decentralized token swaps and liquidity provision across multiple trading pairs within a single contract. Each pool is identified by a composite key (token_a/token_b/fee), allowing different fee tiers for the same token pair and efficient multi-pool management.

## Key Features

- **Multi-Pool Architecture**: Manages unlimited pools in single contract with composite keys (token_a/token_b/fee)
- **Protocol Fees**: Configurable fee percentage (default 40% of swap fees) minted as liquidity to contract owner
- **Slippage Protection**: Users can specify minimum output for swaps, maximum 5% price impact for liquidity operations
- **Single Token Operations**: Add/remove liquidity with one token via automatic internal swaps
- **Multi-Hop Routing**: Swap between any tokens via intermediate pools (up to 3 hops) with Dijkstra pathfinding
- **Price Discovery**: Automatic HTR-based USD pricing for all tokens
- **Emergency Pause**: Owner can pause contract while maintaining withdrawal access
- **Contract Upgradeability**: Built-in upgrade mechanism with version control

## Constants

- \`PRECISION\`: 10^20 (liquidity calculation precision)
- \`MINIMUM_LIQUIDITY\`: 10^3 (minimum liquidity burn multiplier)
- \`MAX_PRICE_IMPACT\`: 500 basis points (5% maximum price impact)
- Default fee: 0.3% (3/1000) - configurable per pool at creation
- Default protocol fee: 40% of swap fees`,
    author: {
      name: 'tothster',
      avatar: 'https://avatars.githubusercontent.com/u/115510731?v=4',
      github: 'tothster',
    },
    version: '1.0.0',
    timestamp: '2025-11-18T12:45:01Z',
    category: 'DeFi',
    code: '// No code preview available',
    codeUrl: 'https://raw.githubusercontent.com/HathorNetwork/community-blueprints/master/blueprints/dozer-pool-manager/dozer_pool_manager.py',
    status: 'Published',
    githubUrl: 'https://github.com/HathorNetwork/community-blueprints/tree/master/blueprints/dozer-pool-manager',
    versionHistory: [{ version: '1.0.0', date: '2025-11-18', changes: 'Initial submission' }],
  },
  {
    id: 'pr-3',
    name: 'Oasis',
    description: 'Liquidity incentive protocol with time-locked deposits, bonus rewards, and impermanent loss protection.',
    longDescription: `# Oasis Blueprint - Liquidity Incentive Protocol

This blueprint implements **Oasis**, a liquidity incentive protocol that integrates with the Dozer Pool Manager to provide time-locked deposits with bonus rewards.

## What it does

Oasis enables users to deposit tokens (Token B) into a liquidity pool alongside HTR, earning bonus rewards based on how long they lock their funds. It acts as an intermediary layer between users and the Dozer Pool Manager, managing deposits, bonuses, and impermanent loss protection.

## Key Features

- **Timelock Bonuses**: Incentivizes longer commitment periods with HTR rewards (10%, 15%, 20%)
- **Impermanent Loss Protection**: Automatically compensates users in HTR when Token B depreciates relative to entry price
- **Minimum Timelock Security**: Enforces 4-month minimum lock after any deposit to prevent weighted average gaming
- **Protocol Fees**: Configurable fees (0-100%) on deposits to support development
- **Price Tracking**: Records entry prices for both HTR and Token B to calculate IL accurately
- **Weighted Average Positions**: Multiple deposits create weighted average entry prices and withdrawal times
- **Contract Upgradeability**: Built-in upgrade mechanism with semantic version validation

## Constants

- \`MIN_DEPOSIT\`: 10,000.00 (minimum initial HTR deposit)
- \`PRECISION\`: 10^20 (liquidity calculation precision)
- \`PRICE_PRECISION\`: 10^8 (8 decimal places for price tracking)
- Bonus rates: 6mo=10%, 9mo=15%, 12mo=20%
- Protocol fee range: 0-1000 thousandths (0-100%)`,
    author: {
      name: 'tothster',
      avatar: 'https://avatars.githubusercontent.com/u/115510731?v=4',
      github: 'tothster',
    },
    version: '1.0.0',
    timestamp: '2025-11-18T12:45:18Z',
    category: 'DeFi',
    code: '// No code preview available',
    codeUrl: 'https://raw.githubusercontent.com/HathorNetwork/community-blueprints/master/blueprints/oasis/oasis.py',
    status: 'Published',
    githubUrl: 'https://github.com/HathorNetwork/community-blueprints/tree/master/blueprints/oasis',
    versionHistory: [{ version: '1.0.0', date: '2025-11-18', changes: 'Initial submission' }],
  },
  {
    id: 'pr-4',
    name: 'OTC Escrow Swap',
    description: 'Trust-minimized on-chain OTC token swaps with public and directed escrows, expiry, and protocol fees.',
    longDescription: `# OTC Escrow Swap Blueprint

This blueprint introduces **OtcEscrowSwap**, a production-ready OTC escrow swap blueprint for the Hathor network.

## What it does

The blueprint enables **trust-minimized, on-chain OTC token swaps** without relying on order books, AMMs, or external oracles. It supports both **public** and **directed** escrows, enforces a strict funding order, implements stage-based expiry and refunds, and applies deterministic protocol fees on execution only.

## Key Features

- Public and directed OTC escrows
- Maker-first funding enforcement
- Explicit accept → fund → withdraw lifecycle
- Stage-based expiry with safe refund paths
- Cancel-before-funding (maker-only)
- Deterministic protocol fees (bps, ceil rounding)
- Strict validation of deposit and withdrawal actions
- Read-only view methods for UI / indexer support

## Design Goals

- Eliminate counterparty risk during OTC swaps
- Ensure deterministic, auditable settlement rules
- Avoid hidden fees or implicit execution
- Provide safe recovery paths (cancel / refund)
- Be compatible with Hathor's PythonVM and Blueprint SDK

## Safety Notes

- Protocol fee is bounded: 0 ≤ bps ≤ 200
- Expiry configuration is fully bounded and owner-configurable
- Fees are charged **only on successful settlement**, never on cancel or refund paths
- All deposits and withdrawals require exact token and amount matching
- Directed escrows strictly enforce taker identity on accept and funding paths`,
    author: {
      name: 'StudzDCL',
      avatar: 'https://avatars.githubusercontent.com/u/64172230?v=4',
      github: 'StudzDCL',
    },
    version: '1.0.0',
    timestamp: '2025-12-31T03:35:28Z',
    category: 'DeFi',
    code: '// No code preview available',
    codeUrl: 'https://raw.githubusercontent.com/HathorNetwork/community-blueprints/master/blueprints/otc_escrow_swap/otc_escrow_swap.py',
    status: 'Published',
    githubUrl: 'https://github.com/HathorNetwork/community-blueprints/tree/master/blueprints/otc_escrow_swap',
    versionHistory: [{ version: '1.0.0', date: '2025-12-31', changes: 'Initial submission' }],
  },
  {
    id: 'pr-6',
    name: 'Pixel Canvas',
    description: 'Collaborative pixel art canvas on-chain. Paint pixels, earn fees, manage a persistent customizable grid.',
    longDescription: `# Pixel Canvas Blueprint

This blueprint implements a collaborative pixel art canvas on the Hathor network.

## What it does

The canvas allows users to paint individual pixels on a shared on-chain grid, with each pixel storing its color, owner, and timestamp. Fees are collected per pixel painted and accumulate in the contract.

## Key Features

**Canvas Management**
- Customizable Grid: The canvas size and the per-pixel fee are defined at initialization
- Persistent State: Stores the color, owner, and timestamp of every painted pixel
- Batch Painting: Supports painting multiple pixels in a single transaction (up to 32) to optimize network fees and user experience

**Economy & Ownership**
- Fee Collection: Every "paint" action requires a deposit of HTR. These fees accumulate within the contract
- Admin Withdrawal: The blueprint owner (the address that initialized the contract) can withdraw the collected fees at any time
- Strict Validation: Includes checks for coordinate bounds, valid hex color formats (#RRGGBB), and sufficient fee deposits`,
    author: {
      name: 'D45putspin',
      avatar: 'https://avatars.githubusercontent.com/u/36547913?v=4',
      github: 'D45putspin',
    },
    version: '1.0.0',
    timestamp: '2026-01-21T10:14:02Z',
    category: 'Gaming',
    code: '// No code preview available',
    codeUrl: 'https://raw.githubusercontent.com/HathorNetwork/community-blueprints/master/blueprints/pxiel/pxiel.py',
    status: 'Published',
    githubUrl: 'https://github.com/HathorNetwork/community-blueprints/tree/master/blueprints/pxiel',
    versionHistory: [{ version: '1.0.0', date: '2026-01-21', changes: 'Initial submission' }],
  },
  {
    id: 'pr-7',
    name: 'HTR Lottery',
    description: 'Single-round HTR lottery with configurable ticket price, commission, and a 30-day draw timeout.',
    longDescription: `# HTR Lottery Blueprint

This blueprint implements a single-round HTR lottery on the Hathor network.

## What it does

The creator initializes the contract with a description, ticket price, and commission percentage, and pays a 10 HTR creation fee. Participants buy tickets by depositing HTR, which accumulates in the pot.

## Main Workflow

1. **Creation**: Creator sets ticket price, commission %, and pays 10 HTR fee
2. **Ticket Sales**: Participants buy tickets by depositing HTR into the pot
3. **Draw**: The creator can draw a winner at any time before a 30-day timeout; after the timeout, anyone can draw
4. **Payout**: The contract computes the commission and prize, tracks creator and winner payouts separately
5. **Withdrawal**: Each party can claim their rewards via withdrawal actions

## Key Features

- Configurable ticket price and commission percentage
- 30-day draw timeout with permissionless draw after expiry
- Separate tracking for creator commission and winner prize
- Events emitted for creation, ticket purchases, winner selection, and reward claims
- Safe withdrawal pattern for claiming rewards`,
    author: {
      name: 'D45putspin',
      avatar: 'https://avatars.githubusercontent.com/u/36547913?v=4',
      github: 'D45putspin',
    },
    version: '1.0.0',
    timestamp: '2026-02-12T17:02:44Z',
    category: 'Betting',
    code: '// No code preview available',
    codeUrl: 'https://raw.githubusercontent.com/HathorNetwork/community-blueprints/master/blueprints/lottery/lottery.py',
    status: 'Published',
    githubUrl: 'https://github.com/HathorNetwork/community-blueprints/tree/master/blueprints/lottery',
    versionHistory: [{ version: '1.0.0', date: '2026-02-12', changes: 'Initial submission' }],
  },
  {
    id: 'hathordice',
    name: 'HathorDice',
    description: 'A gambling nano-contract inspired by SatoshiDice. Players bet against the contract and win a payout proportional to their odds, or lose it all.',
    longDescription: `# HathorDice Blueprint

HathorDice is a gambling contract modeled after the original SatoshiDice. Players wager tokens against the contract: if they win, they receive a payout inversely proportional to their probability of winning. If they lose, they forfeit the entire bet.

## How it works

The house maintains a configurable edge defined in basis points (\`house_edge_basis_points\`). With a 1.9% house edge, the expected return across many plays is 0.981. A liquidity provider system funds the betting pool, and pre-execution payout validation ensures sufficient reserves before any bet is accepted.

## Init parameters

- \`house_edge_basis_points\`: House edge ≤ 10,000 bps (e.g. 190 = 1.9%)
- \`random_bit_length\`: Entropy size (16-32 bits)
- \`max_bet_amount\`: Maximum allowed bet (> 0)
- \`max_multiplier_tenths\`: Payout multiplier cap (in tenths)

## State

- \`liquidity_providers\`: caller_id → LP contribution
- \`total_liquidity_provided\`: Aggregate LP capital
- \`balances\`: Per-user token balances
- \`available_tokens\`: Pool liquidity available for payouts

## Methods

- **initialize**: Sets house edge, randomness, and bet limits
- **bet**: Place a bet; payout pre-validated before the roll
- **add_liquidity**: Deposit tokens to fund the betting pool
- **remove_liquidity**: Withdraw LP tokens from the pool

Built with Hathor Nano Contracts for Bitcoin-grade security and verifiable on-chain randomness.`,
    author: {
      name: 'msbrogli',
      avatar: 'https://github.com/msbrogli.png',
      github: 'msbrogli',
    },
    version: '1.0.0',
    timestamp: '2025-11-19T00:00:00Z',
    category: 'Betting',
    code: `class HathorDice(NanoContract):
    """
    Gambling contract inspired by SatoshiDice.

    Init parameters:
        house_edge_basis_points: House edge (<=10,000 bps, e.g. 190 = 1.9%)
        random_bit_length: Entropy size (16-32 bits)
        max_bet_amount: Maximum allowed bet (> 0)
        max_multiplier_tenths: Payout multiplier cap (in tenths)

    State:
        liquidity_providers: caller_id -> LP contribution
        total_liquidity_provided: aggregate LP capital
        balances: per-user token balances
        available_tokens: pool liquidity available for payouts
    """

    @public
    def initialize(
        self,
        house_edge_basis_points: int,
        random_bit_length: int,
        max_bet_amount: int,
        max_multiplier_tenths: int,
    ) -> None:
        assert 0 < house_edge_basis_points <= 10_000
        assert 16 <= random_bit_length <= 32
        assert max_bet_amount > 0
        self.house_edge_bps = house_edge_basis_points
        self.random_bit_length = random_bit_length
        self.max_bet_amount = max_bet_amount
        self.max_multiplier_tenths = max_multiplier_tenths

    @public
    def bet(self, multiplier_tenths: int) -> None:
        """Place a bet. multiplier_tenths defines odds and payout."""
        assert self.tx.value <= self.max_bet_amount
        assert 0 < multiplier_tenths <= self.max_multiplier_tenths

        payout = self.tx.value * multiplier_tenths // 10
        assert self.available_tokens >= payout, "Insufficient pool liquidity"

        win_probability = 10 * (10_000 - self.house_edge_bps) // multiplier_tenths
        roll = self.random(2 ** self.random_bit_length)

        if roll < win_probability * (2 ** self.random_bit_length) // 10_000:
            self.available_tokens -= payout
            self.transfer(self.tx.caller, payout)
        else:
            self.available_tokens += self.tx.value

    @public
    def add_liquidity(self) -> None:
        self.liquidity_providers[self.tx.caller] += self.tx.value
        self.total_liquidity_provided += self.tx.value
        self.available_tokens += self.tx.value

    @public
    def remove_liquidity(self, amount: int) -> None:
        assert self.liquidity_providers[self.tx.caller] >= amount
        self.liquidity_providers[self.tx.caller] -= amount
        self.total_liquidity_provided -= amount
        self.available_tokens -= amount
        self.transfer(self.tx.caller, amount)`,
    status: 'Published',
    githubUrl: 'https://github.com/HathorNetwork/hathor-core/pull/1484',
    versionHistory: [{ version: '1.0.0', date: '2025-11-19', changes: 'Initial release with payout pre-validation and configurable house edge' }],
  },
  {
    id: 'pr-8',
    name: 'Polls',
    description: 'Token-weighted on-chain voting with linear weight model, time-bounded polls, and vote withdrawal.',
    longDescription: `# Polls Blueprint

**Polls** is a Hathor nano-contract for token-weighted voting where weight = deposited token amount (linear model).

## What it does

Polls enables the creation of on-chain governance votes where each participant's voting power is proportional to their token deposit. Votes can be withdrawn after the poll ends.

## Core Model

- Polls are stored by poll_id, with per-option aggregates (weight, votes)
- Per-voter vote records for withdrawal tracking
- Max 8 options per poll
- Title max 80 chars, description max 300 chars
- Only weighting="linear" with weight_cap=0

## Methods

- **initialize**: Sets owner, optional creation fee, and initializes storage
- **create_poll**: Validates inputs and enforces exact HTR creation fee (if enabled), then creates poll and emits PollCreated
- **cast_vote**: Requires poll live window, valid option, one vote per address per poll, and token deposit; updates totals and emits VoteCast
- **withdraw_vote**: Only after poll end, only voter's own deposit, and only up to remaining amount; emits VoteWithdrawn
- **withdraw_creation_fees**: Owner-only HTR fee withdrawal

## Read APIs

- get_poll_count
- get_poll
- get_poll_option
- get_poll_results
- get_vote`,
    author: {
      name: 'D45putspin',
      avatar: 'https://avatars.githubusercontent.com/u/36547913?v=4',
      github: 'D45putspin',
    },
    version: '1.0.0',
    timestamp: '2026-03-17T10:53:36Z',
    category: 'Governance',
    code: '// No code preview available',
    codeUrl: 'https://raw.githubusercontent.com/HathorNetwork/community-blueprints/master/blueprints/poll/poll.py',
    status: 'Published',
    githubUrl: 'https://github.com/HathorNetwork/community-blueprints/tree/master/blueprints/poll',
    versionHistory: [{ version: '1.0.0', date: '2026-03-17', changes: 'Initial submission' }],
  },
  {
    id: 'pr-9',
    name: 'Token Fair-Launch Platform with Bonding Curves',
    description: 'A pump.fun-style token launchpad with bonding curve pricing. Create, trade, and automatically graduate tokens to a Dozer DEX pool.',
    longDescription: `# Khensu Manager Blueprint - Token Fair-Launch Platform with Bonding Curves

This blueprint implements Khensu Manager, a contract that manages a token launchpad with bonding curve pricing for the Hathor network. Tokens are created, traded on a bonding curve, and automatically graduated to a Dozer DEX pool when they reach a target market cap.

## What it does

Khensu Manager enables a **pump.fun-style** token launchpad where anyone can create a new token, trade it on a bonding curve with built-in price discovery, and have the token automatically migrate its liquidity to a full DEX (Dozer Pool Manager) once the bonding curve reaches its target market cap.

## Main Workflow

### Token Creation
- Anyone can create a new token by depositing the network fee (0.01 HTR)
- The contract mints the full token supply (default: 1 billion tokens) and holds it in reserve
- Token metadata (name, symbol, image url, description, social links) stored on-chain
- URLs validated to require \`https://\` prefix; image links must be >= 32 characters

### Token Trading via Bonding Curve

**Buy Tokens**: Users deposit HTR and withdraw tokens in a single atomic transaction. Price uses a custom bonding curve formula. Buy fee and creator fee collected. Slippage protection via internal balance. Purchase capped at 80% of total supply (remaining 20% reserved for DEX migration).

**Sell Tokens**: Users deposit tokens and withdraw HTR using inverse bonding curve. Sell fee collected. Cannot sell after token migration.

### Automatic Migration to DEX
- Triggered automatically when the bonding curve reaches 80% tokens sold
- Deposits HTR acquired + remaining 20% token supply into a Dozer pool
- Creates and signs the pool on Dozer Pool Manager
- Token marked as migrated; further bonding curve trading is disabled

## Key Features
- **Bonding Curve Pricing**: Custom curve formula with configurable constants
- **Automatic DEX Graduation**: Tokens migrate to Dozer DEX when bonding curve fills
- **Creator Rewards**: Token creators earn a fee on every buy transaction
- **Multi-Tier Fee System**: Configurable fees for buying, selling, and creator rewards
- **Slippage Protection**: Excess tokens/HTR held in internal balance for later withdrawal
- **LRU Cache**: O(1) doubly-linked list tracking most recently active tokens
- **Post-Migration Price Proxy**: After graduation, proxies price quotes from the Dozer DEX pool
- **Search & Discovery**: Token lookup by symbol or name, multiple listing views
- **Multi-Admin Support**: Multiple admin addresses with protected original creator
- **Contract Upgradeability**: Built-in upgrade mechanism with semantic version control`,
    author: {
      name: 'BlueJaySamurai',
      avatar: 'https://avatars.githubusercontent.com/u/172511983?v=4',
      github: 'BlueJaySamurai',
    },
    version: '1.0.0',
    timestamp: '2026-04-23T00:53:36Z',
    category: 'DeFi',
    code: '// No code preview available',
    codeUrl: 'https://raw.githubusercontent.com/HathorNetwork/community-blueprints/e136cff534989de1b8e7ba594ef892cfe4f929e7/blueprints/khensu-manager/khensu_manager.py',
    status: 'Published',
    githubUrl: 'https://github.com/HathorNetwork/community-blueprints/pull/9',
    versionHistory: [{ version: '1.0.0', date: '2026-04-23', changes: 'Initial submission' }],
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  DeFi: 'bg-violet-500/15 text-violet-300 border-violet-500/20',
  Lending: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
  Staking: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20',
  Betting: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
  Gaming: 'bg-green-500/15 text-green-300 border-green-500/20',
  Governance: 'bg-rose-500/15 text-rose-300 border-rose-500/20',
  NFT: 'bg-pink-500/15 text-pink-300 border-pink-500/20',
  Other: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/20',
};

export function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [copied, setCopied] = useState(false);
  const [fetchingCode, setFetchingCode] = useState(false);

  const handleCopyCode = async () => {
    if (!selectedBlueprint) return;
    const isPlaceholder = !selectedBlueprint.code || selectedBlueprint.code === '// No code preview available';
    if (!isPlaceholder) {
      await navigator.clipboard.writeText(selectedBlueprint.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }
    if (selectedBlueprint.codeUrl) {
      setFetchingCode(true);
      try {
        const res = await fetch(selectedBlueprint.codeUrl);
        const code = await res.text();
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } finally {
        setFetchingCode(false);
      }
    }
  };

  const filteredBlueprints = useMemo(() => {
    return HARDCODED_BLUEPRINTS.filter((bp) => {
      const matchesSearch =
        bp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bp.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || bp.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const activeCategories = useMemo(() => {
    const cats = new Set(HARDCODED_BLUEPRINTS.map((bp) => bp.category));
    return CATEGORIES.filter((c) => cats.has(c));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-14 pb-10 border-b border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground border border-border px-2 py-0.5 rounded">
                Community Blueprints
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              <img src="/logo-dark.svg" alt="Blueprint Marketplace" className="h-9 md:h-11 w-auto" />
            </h1>
            <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
              Reusable nano-contract blueprints for Hathor Network built by the community. Royalties for early contributors are coming.
            </p>
            <div className="flex gap-3 pt-1">
              <a
                href="https://github.com/HathorNetwork/community-blueprints"
                target="_blank"
                className="inline-flex items-center h-8 text-sm px-3 rounded-md font-medium transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--cta)', color: 'var(--cta-foreground)', fontFamily: 'var(--font-display)' }}
              >
                <Github className="mr-1.5 h-3.5 w-3.5" />
                Submit Blueprint
              </a>
              <Button size="sm" variant="outline" asChild>
                <a href="https://docs.hathor.network/" target="_blank">
                  Docs <ExternalLink className="ml-1.5 h-3 w-3" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-12 z-40 border-b border-border bg-background/90 backdrop-blur-sm py-3">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-shrink-0 w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search blueprints..."
                className="pl-9 h-8 text-sm bg-secondary/40 border-border focus-visible:ring-primary/40"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-1.5 items-center">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                  selectedCategory === 'All'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
                }`}
              >
                All
              </button>
              {activeCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                    selectedCategory === cat
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blueprint List */}
      <section className="container mx-auto px-4 max-w-4xl py-6">
        <AnimatePresence mode="popLayout">
          {filteredBlueprints.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 text-muted-foreground text-sm"
            >
              No blueprints match your search.{' '}
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="text-primary hover:underline"
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredBlueprints.map((bp, index) => (
                <Dialog key={bp.id}>
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, delay: index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <DialogTrigger asChild>
                      <div
                        className="flex flex-col gap-3 p-4 bg-card hover:bg-secondary/10 border border-border rounded-lg transition-all duration-200 cursor-pointer group"
                        onClick={() => setSelectedBlueprint(bp)}
                      >
                        {/* Top row: category tag + author */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[11px] font-medium px-2 py-0.5 rounded border ${
                              CATEGORY_COLORS[bp.category] ?? CATEGORY_COLORS.Other
                            }`}
                          >
                            {bp.category}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {bp.author.avatar ? (
                              <img
                                src={bp.author.avatar}
                                alt={bp.author.name}
                                className="h-4 w-4 rounded-full"
                              />
                            ) : (
                              <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center text-[8px] text-primary font-bold">
                                {bp.author.name[0]}
                              </div>
                            )}
                            <span className="text-[11px] text-muted-foreground">{bp.author.name}</span>
                          </div>
                        </div>

                        {/* Name */}
                        <div>
                          <h3 className="font-display font-semibold text-sm group-hover:text-primary transition-colors">
                            {bp.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                            {bp.description}
                          </p>
                        </div>

                        {/* Bottom: arrow hint */}
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
                          <span>View details</span>
                          <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </DialogTrigger>
                  </motion.div>

                  {selectedBlueprint?.id === bp.id && (
                    <DialogContent
                      resizable
                      className="w-[85vw] h-[85vh] flex flex-col p-0 gap-0 border-border bg-background min-w-[400px] min-h-[300px] max-w-none max-h-none"
                    >
                      <div className="p-5 border-b border-border">
                        <DialogHeader>
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span
                              className={`text-[11px] font-medium px-2 py-0.5 rounded border ${
                                CATEGORY_COLORS[selectedBlueprint.category] ?? CATEGORY_COLORS.Other
                              }`}
                            >
                              {selectedBlueprint.category}
                            </span>
                            <span className="text-[11px] text-muted-foreground border border-border px-2 py-0.5 rounded font-mono">
                              v{selectedBlueprint.version}
                            </span>
                            <span className="text-[11px] bg-green-500/15 text-green-400 border border-green-500/20 px-2 py-0.5 rounded">
                              Published
                            </span>
                          </div>
                          <DialogTitle className="text-2xl font-bold">{selectedBlueprint.name}</DialogTitle>
                          <DialogDescription className="text-sm mt-1">
                            {selectedBlueprint.description}
                          </DialogDescription>
                        </DialogHeader>
                      </div>

                      <ResizablePanelGroup
                        direction="horizontal"
                        className="flex-1 min-h-0"
                        autoSaveId="blueprint-detail-panels"
                      >
                        <ResizablePanel defaultSize={65} minSize={30}>
                          <ScrollArea className="h-full w-full">
                            <div className="p-5">
                              <div className="prose prose-sm prose-invert max-w-none">
                                <pre className="whitespace-pre-wrap text-sm text-foreground/80 font-sans leading-relaxed">
                                  {selectedBlueprint.longDescription}
                                </pre>
                              </div>
                            </div>
                          </ScrollArea>
                        </ResizablePanel>
                        <ResizableHandle withHandle className="bg-border" />
                        <ResizablePanel defaultSize={35} minSize={20}>
                          <div className="p-5 space-y-6 bg-secondary/10 overflow-y-auto h-full">
                            {/* Author */}
                            <div>
                              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                                Author
                              </h3>
                              <div className="flex items-center gap-3 p-3 rounded border border-border bg-background/40">
                                {selectedBlueprint.author.avatar ? (
                                  <picture>
                                    <img
                                      src={selectedBlueprint.author.avatar}
                                      alt={selectedBlueprint.author.name}
                                      className="h-8 w-8 rounded-full"
                                    />
                                  </picture>
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                    {selectedBlueprint.author.name[0]}
                                  </div>
                                )}
                                <div>
                                  <div className="text-sm font-medium">{selectedBlueprint.author.name}</div>
                                  {selectedBlueprint.author.github && (
                                    <a
                                      href={`https://github.com/${selectedBlueprint.author.github}`}
                                      target="_blank"
                                      className="text-xs text-primary hover:underline flex items-center gap-1"
                                    >
                                      <Github className="h-3 w-3" /> @{selectedBlueprint.author.github}
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Version */}
                            <div>
                              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                                Version
                              </h3>
                              <div className="relative pl-4 border-l border-primary/30">
                                <div className="absolute left-[-4px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                                <div className="text-sm font-mono font-medium">v{selectedBlueprint.version}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  {selectedBlueprint.versionHistory[0]?.changes}
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-2 pt-2">
                              {(selectedBlueprint.code && selectedBlueprint.code !== '// No code preview available') || selectedBlueprint.codeUrl ? (
                                <Button
                                  onClick={handleCopyCode}
                                  disabled={fetchingCode}
                                  className="w-full h-9 text-xs"
                                >
                                  {fetchingCode ? (
                                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                  ) : copied ? (
                                    <Check className="mr-1.5 h-3.5 w-3.5" />
                                  ) : (
                                    <Copy className="mr-1.5 h-3.5 w-3.5" />
                                  )}
                                  {fetchingCode ? 'Fetching...' : copied ? 'Copied!' : 'Copy Blueprint Code'}
                                </Button>
                              ) : (
                                <Button className="w-full h-9 text-xs" asChild>
                                  <a href={selectedBlueprint.githubUrl} target="_blank">
                                    <Github className="mr-1.5 h-3.5 w-3.5" />
                                    View Code on GitHub
                                  </a>
                                </Button>
                              )}
                              <Button variant="outline" className="w-full h-9 text-xs" asChild>
                                <a href={selectedBlueprint.githubUrl} target="_blank">
                                  <Github className="mr-1.5 h-3.5 w-3.5" />
                                  View on GitHub
                                </a>
                              </Button>
                              <p className="text-[10px] text-center text-muted-foreground pt-1">
                                Requires a Hathor Wallet for deployment.
                              </p>
                            </div>
                          </div>
                        </ResizablePanel>
                      </ResizablePanelGroup>
                    </DialogContent>
                  )}
                </Dialog>
              ))}
            </div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
