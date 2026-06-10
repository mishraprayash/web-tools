'use client';

import * as React from 'react';
import { Calculator, DollarSign, Percent, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { ToolLayout } from '@/components/tool/ToolLayout';
import { calculateCosts, type CostCalculation } from '@/tools/llm-pricing/utils';

export default function Page() {
  const [inputTokens, setInputTokens] = React.useState<string>('1000000');
  const [outputTokens, setOutputTokens] = React.useState<string>('50000');
  const [cacheHitPercentage, setCacheHitPercentage] = React.useState<string>('50');
  
  const [sortBy, setSortBy] = React.useState<string>('totalCost');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const parsedInput = parseInt(inputTokens) || 0;
  const parsedOutput = parseInt(outputTokens) || 0;
  const parsedCache = Math.max(0, Math.min(100, parseInt(cacheHitPercentage) || 0));

  const baseResults = React.useMemo(() => {
    return calculateCosts(parsedInput, parsedOutput, parsedCache);
  }, [parsedInput, parsedOutput, parsedCache]);

  const sortedResults = React.useMemo(() => {
    const list = [...baseResults];
    const multiplier = sortDirection === 'desc' ? -1 : 1;

    list.sort((a, b) => {
      if (sortBy === 'name') {
        return a.model.name.localeCompare(b.model.name) * multiplier;
      }
      if (sortBy === 'provider') {
        return a.model.provider.localeCompare(b.model.provider) * multiplier;
      }
      if (sortBy === 'cachedInputCost') {
        return (a.cachedInputCost - b.cachedInputCost) * multiplier;
      }
      if (sortBy === 'uncachedInputCost') {
        return (a.uncachedInputCost - b.uncachedInputCost) * multiplier;
      }
      if (sortBy === 'outputCost') {
        return (a.outputCost - b.outputCost) * multiplier;
      }
      if (sortBy === 'totalCost') {
        return (a.totalCost - b.totalCost) * multiplier;
      }
      return 0;
    });

    return list;
  }, [baseResults, sortBy, sortDirection]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="h-3.5 w-3.5 opacity-40 shrink-0" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="h-3.5 w-3.5 text-accent shrink-0" />
      : <ChevronDown className="h-3.5 w-3.5 text-accent shrink-0" />;
  };

  const formatCurrency = (amount: number) => {
    if (amount === 0) return '$0.00';
    if (amount < 0.0001) return '< $0.0001';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(amount);
  };

  return (
    <ToolLayout
      name="LLM Pricing Calculator"
      description="Compare token costs across major AI models like GPT-4o, Claude 3.5 Sonnet, Gemini 1.5, and DeepSeek, with prompt caching optimizations."
      category="Text"
    >
      <div className="space-y-8">
        
        {/* Token Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border border-border bg-bg-secondary">
            <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-accent" /> Input Tokens (Prompt)
            </label>
            <input 
              type="number"
              value={inputTokens}
              onChange={(e) => setInputTokens(e.target.value)}
              min={0}
              className="w-full h-12 px-4 rounded-lg bg-bg-tertiary border border-border text-text-primary text-lg font-mono focus:border-accent focus:outline-none transition-colors"
            />
          </div>
          <div className="p-5 rounded-xl border border-border bg-bg-secondary">
            <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-purple-500" /> Output Tokens (Completion)
            </label>
            <input 
              type="number"
              value={outputTokens}
              onChange={(e) => setOutputTokens(e.target.value)}
              min={0}
              className="w-full h-12 px-4 rounded-lg bg-bg-tertiary border border-border text-text-primary text-lg font-mono focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>
          <div className="p-5 rounded-xl border border-border bg-bg-secondary">
            <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-emerald-500" /> Prompt Cache Hit Ratio
              </span>
              <span className="text-xs text-text-muted font-mono">{parsedCache}%</span>
            </label>
            <div className="space-y-3">
              <input 
                type="range"
                value={cacheHitPercentage}
                onChange={(e) => setCacheHitPercentage(e.target.value)}
                min={0}
                max={100}
                className="w-full h-2 rounded bg-bg-tertiary appearance-none cursor-pointer accent-accent"
              />
              <input 
                type="number"
                value={cacheHitPercentage}
                onChange={(e) => setCacheHitPercentage(e.target.value)}
                min={0}
                max={100}
                className="w-full h-8 px-2 rounded bg-bg-tertiary border border-border text-text-primary text-xs font-mono text-center focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="rounded-xl border border-border bg-bg-secondary overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-text-muted uppercase bg-bg-tertiary border-b border-border select-none">
                <tr>
                  <th 
                    onClick={() => handleSort('name')}
                    className="px-6 py-4 font-semibold cursor-pointer hover:bg-bg-hover transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      Model {renderSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('provider')}
                    className="px-6 py-4 font-semibold cursor-pointer hover:bg-bg-hover transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      Provider {renderSortIcon('provider')}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('cachedInputCost')}
                    className="px-6 py-4 font-semibold cursor-pointer hover:bg-bg-hover transition-colors text-right"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      Cached Input Cost {renderSortIcon('cachedInputCost')}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('uncachedInputCost')}
                    className="px-6 py-4 font-semibold cursor-pointer hover:bg-bg-hover transition-colors text-right"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      Uncached Input Cost {renderSortIcon('uncachedInputCost')}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('outputCost')}
                    className="px-6 py-4 font-semibold cursor-pointer hover:bg-bg-hover transition-colors text-right"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      Output Cost {renderSortIcon('outputCost')}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('totalCost')}
                    className="px-6 py-4 font-semibold cursor-pointer hover:bg-bg-hover transition-colors text-right text-accent"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <DollarSign className="h-3.5 w-3.5" /> Total Cost {renderSortIcon('totalCost')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedResults.map((res) => (
                  <tr key={res.model.id} className="hover:bg-bg-hover transition-colors">
                    <td className="px-6 py-4 font-medium text-text-primary">
                      {res.model.name}
                      <span className="ml-2 text-[10px] text-text-muted bg-bg-tertiary px-1.5 py-0.5 rounded border border-border">
                        {(res.model.contextWindow / 1000).toFixed(0)}k ctx
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{res.model.provider}</td>
                    <td className="px-6 py-4 text-right font-mono text-text-secondary">{formatCurrency(res.cachedInputCost)}</td>
                    <td className="px-6 py-4 text-right font-mono text-text-secondary">{formatCurrency(res.uncachedInputCost)}</td>
                    <td className="px-6 py-4 text-right font-mono text-text-secondary">{formatCurrency(res.outputCost)}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-text-primary bg-accent/5">{formatCurrency(res.totalCost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}
