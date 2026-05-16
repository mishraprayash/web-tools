import * as React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface ToolLayoutProps {
  name: string;
  description: string;
  category: string;
  children: React.ReactNode;
}

export function ToolLayout({ name, description, category, children }: ToolLayoutProps) {
  return (
    <div className="flex-1 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
          <Link href="/" className="hover:text-text-primary transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-text-secondary">{category}</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-text-primary">{name}</span>
        </nav>

        {/* Tool header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold font-outfit">{name}</h1>
          <p className="mt-1.5 text-sm text-text-secondary">{description}</p>
        </div>

        {/* Tool content */}
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
