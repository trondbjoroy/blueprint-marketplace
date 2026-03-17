# Hathor Blueprint Marketplace

A community-driven marketplace for reusable nano-contract blueprints on the [Hathor Network](https://hathor.network/).

## Overview

Browse, discover, and submit nano-contract blueprints built by the Hathor community. Royalties for blueprint developers are coming—being an early contributor can pay off!

## Features

- Browse community-submitted nano-contract blueprints
- Filter by category and search by name or author
- View blueprint details, source code, and metadata
- Submit blueprints via the [Community Blueprints repository](https://github.com/HathorNetwork/community-blueprints)

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [NextAuth.js](https://next-auth.js.org/) (GitHub OAuth)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) or Node.js 18+
- A GitHub OAuth app (for authentication)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/trondbjoroy/blueprint-marketplace.git
   cd blueprint-marketplace
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Copy the environment template and fill in your values:
   ```bash
   cp .env.example .env
   ```

   Required variables:
   - `NEXTAUTH_SECRET` — Random secret for NextAuth session encryption
   - `NEXTAUTH_URL` — Your deployment URL (e.g. `http://localhost:3000`)
   - `GITHUB_CLIENT_ID` — GitHub OAuth app client ID
   - `GITHUB_CLIENT_SECRET` — GitHub OAuth app client secret

4. Run the development server:
   ```bash
   bun dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Submitting a Blueprint

Blueprints are submitted directly via GitHub Pull Request to the [community-blueprints](https://github.com/HathorNetwork/community-blueprints) repository.

## Related Links

- [Hathor Network](https://hathor.network/)
- [Hathor Docs](https://docs.hathor.network/)
- [Hathor Forge](https://github.com/hathornetwork/hathor-forge)
- [Community Blueprints Repository](https://github.com/HathorNetwork/community-blueprints)
