'use client';

import * as React from 'react';
import { lookupMacAddress, type MacLookupResult } from '@/tools/mac-lookup/utils';
import { ShieldAlert, Cpu, Clipboard, Check, Database } from 'lucide-react';
import { ToolLayout } from '@/components/tool/ToolLayout';

export default function MacLookupPage() {
  const [macInput, setMacInput] = React.useState('00:0C:29:ab:cd:ef');
  const [copied, setCopied] = React.useState(false);

  const result = React.useMemo(() => {
    return lookupMacAddress(macInput);
  }, [macInput]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      name="MAC Address Lookup"
      description="Deconstruct MAC addresses to identify physical transmission interfaces, admin layers, and manufacturers"
      category="Security"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left input card */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide">Interface Input</h2>
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase">Hardware MAC Address</label>
              <input
                type="text"
                value={macInput}
                onChange={(e) => setMacInput(e.target.value)}
                placeholder="e.g. 00:0C:29:AB:CD:EF"
                className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              />
            </div>
            <p className="text-[10px] text-text-muted leading-relaxed">
              Supports hex segments separated by colons, hyphens, periods, or raw contiguous characters.
            </p>
          </div>
        </div>

        {/* Right Output results */}
        <div className="md:col-span-2">
          {result.success ? (
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-2 text-accent">
                  <Cpu className="w-5 h-5" />
                  <h3 className="font-semibold text-text-primary">Interface Address Analysis</h3>
                </div>
                <button
                  onClick={() => handleCopy(result.data.formatted)}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs border border-border rounded-md hover:bg-bg-hover text-text-secondary cursor-pointer transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Clipboard className="w-3.5 h-3.5" />
                      <span>Copy formatted</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-muted/10 border border-border rounded-lg">
                  <span className="block text-[10px] font-semibold text-text-muted uppercase mb-0.5">Normalized Format</span>
                  <span className="font-mono text-sm text-text-primary font-bold">{result.data.formatted}</span>
                </div>

                <div className="p-3 bg-muted/10 border border-border rounded-lg">
                  <span className="block text-[10px] font-semibold text-text-muted uppercase mb-0.5">OUI Hex Prefix</span>
                  <span className="font-mono text-sm text-text-primary">{result.data.oui}</span>
                </div>

                <div className="p-3 bg-muted/10 border border-border rounded-lg">
                  <span className="block text-[10px] font-semibold text-text-muted uppercase mb-0.5">Transmission Scope</span>
                  <span className={`text-xs font-semibold ${result.data.transmissionType === 'Unicast' ? 'text-green-500' : 'text-amber-500'}`}>
                    {result.data.transmissionType}
                  </span>
                </div>

                <div className="p-3 bg-muted/10 border border-border rounded-lg">
                  <span className="block text-[10px] font-semibold text-text-muted uppercase mb-0.5">Administration Scope</span>
                  <span className="text-xs text-text-primary font-medium">
                    {result.data.administrationType}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-muted/20 border border-border rounded-xl flex items-start gap-3">
                <Database className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Manufacturer / Vendor</h4>
                  <p className="text-sm font-semibold text-accent mt-1">{result.data.vendor}</p>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">
                    Identified by parsing the Organizationally Unique Identifier (OUI) blocks registered with the IEEE.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-sm flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <span>{result.error}</span>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
