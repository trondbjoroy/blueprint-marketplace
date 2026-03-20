'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex h-12 items-center justify-between px-4 max-w-4xl">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo-dark.svg" alt="Blueprint Marketplace" className="h-4 w-auto" />
          <span className="hidden sm:inline-block text-[10px] font-mono text-muted-foreground border border-border px-1.5 py-0.5 rounded">
            Hathor Network
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-4 md:flex">
            <a
              href="https://github.com/hathornetwork/hathor-forge"
              target="_blank"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Hathor Forge
            </a>
            <a
              href="https://docs.hathor.network/"
              target="_blank"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              Docs <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
          <a
            href="https://github.com/HathorNetwork/community-blueprints"
            target="_blank"
            className="inline-flex items-center h-7 text-xs px-3 rounded-md font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--cta)', color: 'var(--cta-foreground)', fontFamily: 'var(--font-display)' }}
          >
            <Github className="mr-1.5 h-3 w-3" />
            Submit
          </a>
        </div>
      </div>
    </nav>
  );
}
