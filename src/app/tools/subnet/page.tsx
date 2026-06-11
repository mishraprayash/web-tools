'use client';

import * as React from 'react';
import { calculateSubnet, type SubnetInfo } from '@/tools/subnet/utils';
import { Network, Globe, Copy, Check, Info } from 'lucide-react';
import { ToolLayout } from '@/components/tool/ToolLayout';

export default function SubnetCalculatorPage() {
  const [ipAddress, setIpAddress] = React.useState('192.168.1.1');
  const [cidr, setCidr] = React.useState(24);
  const [copiedType, setCopiedType] = React.useState<string | null>(null);

  const result = React.useMemo(() => {
    return calculateSubnet(ipAddress, cidr);
  }, [ipAddress, cidr]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <ToolLayout
      name="IP Subnet Calculator"
      description="Calculate network parameters, usable range, and private space boundaries from CIDR masks"
      category="Encoding"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left configurations */}
        <div className="space-y-4 md:col-span-1">
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide">Network Configurations</h2>
            
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1 uppercase">IP Address</label>
              <input
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="e.g. 192.168.1.1"
                className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase">CIDR Prefix: /{cidr}</label>
              <input
                type="range"
                min="0"
                max="32"
                value={cidr}
                onChange={(e) => setCidr(parseInt(e.target.value, 10))}
                className="w-full h-2 rounded-lg bg-bg-tertiary appearance-none cursor-pointer accent-accent border border-border"
              />
            </div>
          </div>
        </div>

        {/* Right Outputs */}
        <div className="md:col-span-2 space-y-4">
          {result.success ? (
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-accent pb-2 border-b border-border">
                <Network className="w-5 h-5" />
                <h3 className="font-semibold text-text-primary">Subnet Calculation Results</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-muted/20 p-3 rounded-lg border border-border flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-semibold text-text-muted uppercase">Subnet Mask</span>
                    <span className="font-mono text-sm text-text-primary">{result.data.subnetMask}</span>
                  </div>
                  <button onClick={() => handleCopy(result.data.subnetMask, 'mask')} className="text-text-muted hover:text-text-primary cursor-pointer">
                    {copiedType === 'mask' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="bg-muted/20 p-3 rounded-lg border border-border flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-semibold text-text-muted uppercase">Network Address</span>
                    <span className="font-mono text-sm text-text-primary">{result.data.networkAddress}</span>
                  </div>
                  <button onClick={() => handleCopy(result.data.networkAddress, 'net')} className="text-text-muted hover:text-text-primary cursor-pointer">
                    {copiedType === 'net' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="bg-muted/20 p-3 rounded-lg border border-border flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-semibold text-text-muted uppercase">Usable IP Range</span>
                    <span className="font-mono text-xs text-text-primary">
                      {result.data.firstUsable} — {result.data.lastUsable}
                    </span>
                  </div>
                  <button onClick={() => handleCopy(`${result.data.firstUsable} - ${result.data.lastUsable}`, 'range')} className="text-text-muted hover:text-text-primary cursor-pointer">
                    {copiedType === 'range' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="bg-muted/20 p-3 rounded-lg border border-border flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-semibold text-text-muted uppercase">Broadcast Address</span>
                    <span className="font-mono text-sm text-text-primary">{result.data.broadcastAddress}</span>
                  </div>
                  <button onClick={() => handleCopy(result.data.broadcastAddress, 'bcast')} className="text-text-muted hover:text-text-primary cursor-pointer">
                    {copiedType === 'bcast' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Class & Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-border pt-4">
                <div>
                  <span className="block text-[10px] font-semibold text-text-muted uppercase">Usable Hosts</span>
                  <span className="font-mono text-sm font-semibold text-accent">{result.data.usableHosts.toLocaleString()}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-semibold text-text-muted uppercase">Total Hosts</span>
                  <span className="font-mono text-sm text-text-primary">{result.data.totalHosts.toLocaleString()}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-semibold text-text-muted uppercase">IP Class</span>
                  <span className="font-mono text-sm text-text-primary">Class {result.data.ipClass}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-semibold text-text-muted uppercase">Scope type</span>
                  <span className={`font-mono text-sm font-semibold ${result.data.isPrivate ? 'text-amber-500' : 'text-blue-500'}`}>
                    {result.data.isPrivate ? 'Private Space' : 'Public Internet'}
                  </span>
                </div>
              </div>

              {/* Binary Outputs */}
              <div className="space-y-3 pt-4 border-t border-border">
                <span className="block text-xs font-semibold text-text-muted uppercase tracking-wider">Binary Representations</span>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-text-secondary font-medium">IP address bits:</span>
                    <span className="font-mono text-accent text-right break-all">{result.data.ipBinary}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-text-secondary font-medium">Subnet mask bits:</span>
                    <span className="font-mono text-text-muted text-right break-all">{result.data.maskBinary}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-sm flex items-center gap-2">
              <Info className="w-5 h-5 flex-shrink-0" />
              <span>{result.error}</span>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
