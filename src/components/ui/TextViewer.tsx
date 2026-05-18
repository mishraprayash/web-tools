'use client';

import * as React from 'react';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="bg-accent/20 rounded">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

function useHighlightedText(
  value: string,
  searchQuery: string,
  activeIndex: number,
): { nodes: React.ReactNode[]; matchIndices: number[] } {
  return React.useMemo(() => {
    const lines = value.split('\n');
    const q = searchQuery.toLowerCase().trim();

    if (!q) {
      return {
        nodes: lines.map((line, i) => (
          <div key={i} className="leading-relaxed whitespace-pre-wrap break-all">{line}</div>
        )),
        matchIndices: [],
      };
    }

    const matched = lines.map((line) => line.toLowerCase().includes(q));
    const matchIndices = lines.map((_, i) => i).filter((i) => matched[i]);
    const active = matchIndices[activeIndex] ?? -1;

    return {
      matchIndices,
      nodes: lines.map((line, i) => {
        const isActive = i === active;
        const isMatched = matched[i];
        const lineBg = isActive
          ? 'bg-accent/15 ring-2 ring-accent ring-inset'
          : isMatched
            ? 'bg-accent/8'
            : '';
        const opacity = !isMatched ? 'opacity-40' : '';

        return (
          <div
            key={i}
            data-line={i}
            className={cn(
              'leading-relaxed whitespace-pre-wrap break-all',
              opacity,
              isMatched && 'rounded -mx-1 px-1',
              lineBg,
            )}
          >
            {highlightMatch(line, q)}
          </div>
        );
      }),
    };
  }, [value, searchQuery, activeIndex]);
}

interface TextViewerProps {
  value: string;
  maxHeight?: string;
  minHeight?: string;
  placeholder?: string;
  // optional HTML rendering mode (safe: only spans with classes produced by our tokeniser)
  renderHtml?: boolean;
}

export function TextViewer({
  value,
  maxHeight = '480px',
  minHeight = '240px',
  placeholder = 'No output',
  renderHtml = false,
}: TextViewerProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { nodes: highlighted, matchIndices } = useHighlightedText(
    value,
    searchQuery,
    activeIndex,
  );

  const matchCount = matchIndices.length;

  const scrollToActive = React.useCallback(() => {
    if (!scrollRef.current || matchIndices.length === 0) return;
    const el = scrollRef.current.querySelector(
      `[data-line="${matchIndices[activeIndex]}"]`,
    ) as HTMLElement | null;
    if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [activeIndex, matchIndices]);

  React.useEffect(() => {
    scrollToActive();
  }, [activeIndex, scrollToActive]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (matchIndices.length === 0) return;
      if (e.shiftKey) {
        setActiveIndex((i) => (i - 1 + matchIndices.length) % matchIndices.length);
      } else {
        setActiveIndex((i) => (i + 1) % matchIndices.length);
      }
    }
  };

  return (
    <div className="flex flex-col border border-border rounded-xl overflow-hidden">
      <div
        ref={scrollRef}
        className="flex-1 p-4 bg-bg-tertiary overflow-auto font-mono text-sm text-text-primary whitespace-pre"
        style={{ maxHeight, minHeight }}
      >
        {value ? (
          renderHtml ? (
            <div className="prose text-sm" dangerouslySetInnerHTML={{ __html: value }} />
          ) : (
            highlighted
          )
        ) : (
          <span className="text-text-muted">{placeholder}</span>
        )}
      </div>
      <div className="flex items-center gap-2 px-4 py-2 bg-bg-secondary border-t border-border">
        <Search className="h-3.5 w-3.5 text-text-muted shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setActiveIndex(0); }}
          onKeyDown={handleKeyDown}
          placeholder="Search in output..."
          className="flex-1 bg-transparent text-xs text-text-primary placeholder:text-text-muted focus:outline-none"
        />
        {matchIndices.length > 0 && (
          <>
            <span className="text-xs text-text-muted whitespace-nowrap tabular-nums">
              {activeIndex + 1}/{matchCount}
            </span>
            <button
              onClick={() =>
                setActiveIndex((i) => (i - 1 < 0 ? matchCount - 1 : i - 1))
              }
              className="p-0.5 text-text-muted hover:text-text-primary transition-colors disabled:opacity-30"
              disabled={matchCount <= 1}
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setActiveIndex((i) => (i + 1) % matchCount)}
              className="p-0.5 text-text-muted hover:text-text-primary transition-colors disabled:opacity-30"
              disabled={matchCount <= 1}
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </>
        )}
        {searchQuery && matchIndices.length === 0 && (
          <span className="text-xs text-text-muted">No matches</span>
        )}
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveIndex(0);
            }}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
