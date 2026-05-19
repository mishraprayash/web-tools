'use client';

import * as React from 'react';
import { KeyRound, Download, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Select } from '@/components/ui/Select';
import { GradientBox } from '@/components/ui/GradientBox';
import { ToolLayout } from '@/components/tool/ToolLayout';
import { generateRsaKeypair, type GeneratedKeypair } from '@/tools/rsa-generator/utils';
import { toast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

const keySizeOptions = [
  { value: '1024', label: '1024 bits (Weak - Testing only)' },
  { value: '2048', label: '2048 bits (Standard - Recommended)' },
  { value: '4096', label: '4096 bits (Extra Secure)' },
];

const hashOptions = [
  { value: 'SHA-256', label: 'SHA-256' },
  { value: 'SHA-384', label: 'SHA-384' },
  { value: 'SHA-512', label: 'SHA-512' },
];

export default function Page() {
  const [keySize, setKeySize] = React.useState('2048');
  const [hashAlgo, setHashAlgo] = React.useState('SHA-256');
  const [keypair, setKeypair] = React.useState<GeneratedKeypair | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [showPrivateKey, setShowPrivateKey] = React.useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setKeypair(null);
    try {
      // Small timeout to let spinner render before heavy crypto thread blocks main thread
      await new Promise((resolve) => setTimeout(resolve, 100));
      const result = await generateRsaKeypair({
        keySize: parseInt(keySize, 10) as any,
        hashAlgorithm: hashAlgo as any,
      });
      setKeypair(result);
      toast({ type: 'success', message: 'RSA Key pair generated successfully!' });
    } catch (e) {
      toast({ type: 'error', message: `Generation failed: ${(e as Error).message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (keyText: string, filename: string) => {
    const blob = new Blob([keyText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast({ type: 'success', message: `Downloaded ${filename}` });
  };

  return (
    <ToolLayout
      name="RSA Keypair Generator"
      description="Generate standard-compliant Public/Private RSA keys entirely in the browser using Web Crypto API"
      category="Security"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side Settings */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-text-secondary">Key Generation Configurations</h2>
          </div>

          <div className="p-5 rounded-xl border border-border bg-bg-secondary space-y-4">
            <Select
              label="RSA Modulus Length (Key Size)"
              options={keySizeOptions}
              value={keySize}
              onChange={(e) => setKeySize(e.target.value)}
            />

            <Select
              label="Hashing Signature Algorithm"
              options={hashOptions}
              value={hashAlgo}
              onChange={(e) => setHashAlgo(e.target.value)}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full h-12 text-sm font-semibold"
            icon={loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
          >
            {loading ? 'Computing Prime Factors...' : 'Generate New RSA Keypair'}
          </Button>

          <div className="p-4 rounded-xl border border-border bg-bg-secondary flex gap-3 text-xs text-text-muted">
            <KeyRound className="h-5 w-5 text-accent shrink-0" />
            <div>
              <p className="font-semibold text-text-primary mb-0.5">Secure Browser Generation</p>
              <p className="leading-relaxed">Key generation occurs entirely within your local browser sandbox utilizing cryptographically secure entropy. Zero key material is ever transmitted to external servers.</p>
            </div>
          </div>
        </div>

        {/* Right Side Outputs */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-text-secondary">Exported PEM Keys</h2>
          </div>

          {keypair ? (
            <div className="space-y-6 animate-fade-in">
              {/* Public Key Display */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Public Key (SPKI)</span>
                  <div className="flex items-center gap-2">
                    <CopyButton value={keypair.publicKey} size="sm" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(keypair.publicKey, 'id_rsa_pub.pem')}
                      icon={<Download className="h-3.5 w-3.5" />}
                    >
                      Download
                    </Button>
                  </div>
                </div>
                <GradientBox value={keypair.publicKey} className="min-h-[140px] text-xs" />
              </div>

              {/* Private Key Display */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Private Key (PKCS#8)</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                      icon={showPrivateKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    >
                      {showPrivateKey ? 'Hide Key' : 'Reveal Key'}
                    </Button>
                    <CopyButton value={keypair.privateKey} size="sm" disabled={!showPrivateKey} />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(keypair.privateKey, 'id_rsa.pem')}
                      icon={<Download className="h-3.5 w-3.5" />}
                      disabled={!showPrivateKey}
                    >
                      Download
                    </Button>
                  </div>
                </div>
                
                {showPrivateKey ? (
                  <GradientBox value={keypair.privateKey} className="min-h-[220px] text-xs shadow-md animate-fade-in border-warning/20" />
                ) : (
                  <div className="w-full h-32 rounded-lg bg-bg-tertiary border border-border border-dashed flex flex-col items-center justify-center text-text-muted text-xs gap-1.5 select-none">
                    <EyeOff className="h-5 w-5 opacity-40" />
                    <span>Private key is hidden for security. Click 'Reveal Key' to inspect.</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[300px] rounded-xl bg-bg-tertiary border border-border border-dashed text-text-muted text-sm italic gap-2 text-center p-6">
              <KeyRound className="h-8 w-8 opacity-30 animate-pulse-glow" />
              <div>
                <p className="font-semibold text-text-secondary not-italic text-sm">No Keypair Generated</p>
                <p className="text-xs text-text-muted max-w-xs mt-0.5">Click 'Generate New RSA Keypair' on the left to compute a secure key pair.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
