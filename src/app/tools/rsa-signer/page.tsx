'use client';

import * as React from 'react';
import { Shield, Settings, Check, X, ShieldAlert, Sparkles, KeyRound, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Select } from '@/components/ui/Select';
import { GradientBox } from '@/components/ui/GradientBox';
import { ToolLayout } from '@/components/tool/ToolLayout';
import { signPayloadRsa, verifySignatureRsa } from '@/tools/rsa-signer/utils';
import { toast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

const hashOptions = [
  { value: 'SHA-256', label: 'SHA-256' },
  { value: 'SHA-384', label: 'SHA-384' },
  { value: 'SHA-512', label: 'SHA-512' },
];

export default function Page() {
  const [activeTab, setActiveTab] = React.useState<'sign' | 'verify'>('sign');

  // --- Sign Tab States ---
  const [privateKey, setPrivateKey] = React.useState('');
  const [signPayload, setSignPayload] = React.useState('Hello World! Sign this payload using RSA.');
  const [signHash, setSignHash] = React.useState<'SHA-256' | 'SHA-384' | 'SHA-512'>('SHA-256');
  const [signatureOutput, setSignatureOutput] = React.useState('');
  const [signError, setSignError] = React.useState<string | null>(null);
  const [signLoading, setSignLoading] = React.useState(false);

  // --- Verify Tab States ---
  const [publicKey, setPublicKey] = React.useState('');
  const [verifyPayload, setVerifyPayload] = React.useState('Hello World! Sign this payload using RSA.');
  const [verifySignature, setVerifySignature] = React.useState('');
  const [verifyHash, setVerifyHash] = React.useState<'SHA-256' | 'SHA-384' | 'SHA-512'>('SHA-256');
  const [verificationResult, setVerificationResult] = React.useState<boolean | null>(null);
  const [verifyError, setVerifyError] = React.useState<string | null>(null);
  const [verifyLoading, setVerifyLoading] = React.useState(false);

  const handleSign = async () => {
    if (!privateKey.trim()) {
      toast({ type: 'error', message: 'Please enter a Private Key first.' });
      return;
    }
    setSignLoading(true);
    setSignatureOutput('');
    setSignError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 50));
      const sig = await signPayloadRsa(privateKey, signPayload, signHash);
      setSignatureOutput(sig);
      toast({ type: 'success', message: 'Signature generated!' });
    } catch (e) {
      setSignError((e as Error).message);
    } finally {
      setSignLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!publicKey.trim()) {
      toast({ type: 'error', message: 'Please enter a Public Key.' });
      return;
    }
    if (!verifySignature.trim()) {
      toast({ type: 'error', message: 'Please enter the Signature.' });
      return;
    }
    setVerifyLoading(true);
    setVerificationResult(null);
    setVerifyError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 50));
      const isValid = await verifySignatureRsa(publicKey, verifyPayload, verifySignature, verifyHash);
      setVerificationResult(isValid);
      if (isValid) {
        toast({ type: 'success', message: 'Signature is VALID!' });
      } else {
        toast({ type: 'error', message: 'Signature is INVALID!' });
      }
    } catch (e) {
      setVerifyError((e as Error).message);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleClearSign = () => {
    setPrivateKey('');
    setSignatureOutput('');
    setSignError(null);
  };

  const handleClearVerify = () => {
    setPublicKey('');
    setVerifySignature('');
    setVerificationResult(null);
    setVerifyError(null);
  };

  return (
    <ToolLayout
      name="RSA Signature Signer & Verifier"
      description="Generate secure digital signatures using RSA private keys and verify them against RSA public keys client-side"
      category="Security"
    >
      {/* Tab Switcher */}
      <div className="flex border-b border-border/80 mb-6 select-none">
        <button
          onClick={() => setActiveTab('sign')}
          className={cn(
            'px-5 py-3 border-b-2 font-medium text-sm transition-all duration-200',
            activeTab === 'sign'
              ? 'border-accent text-accent font-semibold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          )}
        >
          Sign Text / Payload
        </button>
        <button
          onClick={() => setActiveTab('verify')}
          className={cn(
            'px-5 py-3 border-b-2 font-medium text-sm transition-all duration-200',
            activeTab === 'verify'
              ? 'border-accent text-accent font-semibold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          )}
        >
          Verify Digital Signature
        </button>
      </div>

      {activeTab === 'sign' ? (
        /* Tab 1: Sign Text */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
          {/* Left Inputs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-text-secondary">Signing Inputs</h2>
              <Button variant="ghost" size="sm" onClick={handleClearSign}>Reset</Button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase">RSA Private Key (PEM format)</label>
                <textarea
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  placeholder="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC..."
                  className="w-full h-40 p-3 rounded-lg bg-bg-tertiary border border-border font-mono text-xs text-text-primary focus:outline-none focus:border-accent resize-none shadow-inner"
                  spellCheck={false}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase">Text Payload to Sign</label>
                <textarea
                  value={signPayload}
                  onChange={(e) => setSignPayload(e.target.value)}
                  className="w-full h-24 p-3 rounded-lg bg-bg-tertiary border border-border text-sm text-text-primary focus:outline-none focus:border-accent resize-none shadow-inner"
                />
              </div>

              <div className="p-4 rounded-xl border border-border bg-bg-secondary space-y-4">
                <Select
                  label="Signature Hashing Algorithm"
                  options={hashOptions}
                  value={signHash}
                  onChange={(e) => setSignHash(e.target.value as any)}
                />
              </div>
            </div>

            <Button
              onClick={handleSign}
              disabled={signLoading}
              className="w-full h-11 text-sm font-semibold mt-2"
              icon={signLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
            >
              {signLoading ? 'Signing Payload...' : 'Generate Cryptographic Signature'}
            </Button>

            {signError && (
              <div className="p-4 rounded-xl bg-error/10 text-error border border-error/30 text-xs flex gap-2.5 items-start shadow-sm animate-fade-in">
                <ShieldAlert className="h-5 w-5 shrink-0 text-error mt-0.5" />
                <p className="leading-relaxed font-semibold">{signError}</p>
              </div>
            )}
          </div>

          {/* Right Signature Output */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-text-secondary">Generated Base64 Signature</h2>
              <CopyButton value={signatureOutput} disabled={!signatureOutput} />
            </div>

            <GradientBox value={signatureOutput} placeholder="RSA base64 signature will appear here..." className="min-h-[220px]" />

            <div className="p-4 rounded-xl border border-border bg-bg-secondary flex gap-3 text-xs text-text-muted select-none shadow-sm">
              <Sparkles className="h-5 w-5 text-accent shrink-0 animate-pulse-glow" />
              <div>
                <p className="font-semibold text-text-primary mb-0.5">Asymmetric Signature Verification</p>
                <p className="leading-relaxed">This signature is generated locally using standard RSASSA-PKCS1-v1_5. Your private key never leaves your local browser session, assuring absolute data isolation.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: Verify Signature */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
          {/* Left Inputs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-text-secondary">Verification Inputs</h2>
              <Button variant="ghost" size="sm" onClick={handleClearVerify}>Reset</Button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase">RSA Public Key (PEM format)</label>
                <textarea
                  value={publicKey}
                  onChange={(e) => setPublicKey(e.target.value)}
                  placeholder="-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoIBAQC..."
                  className="w-full h-36 p-3 rounded-lg bg-bg-tertiary border border-border font-mono text-xs text-text-primary focus:outline-none focus:border-accent resize-none shadow-inner"
                  spellCheck={false}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase">Original Text Payload</label>
                <textarea
                  value={verifyPayload}
                  onChange={(e) => setVerifyPayload(e.target.value)}
                  className="w-full h-20 p-3 rounded-lg bg-bg-tertiary border border-border text-sm text-text-primary focus:outline-none focus:border-accent resize-none shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase">Base64 Signature to Verify</label>
                <textarea
                  value={verifySignature}
                  onChange={(e) => setVerifySignature(e.target.value)}
                  placeholder="Paste signature generated during signing..."
                  className="w-full h-20 p-3 rounded-lg bg-bg-tertiary border border-border font-mono text-xs text-text-primary focus:outline-none focus:border-accent resize-none shadow-inner"
                />
              </div>

              <div className="p-4 rounded-xl border border-border bg-bg-secondary space-y-4">
                <Select
                  label="Verification Hashing Algorithm"
                  options={hashOptions}
                  value={verifyHash}
                  onChange={(e) => setVerifyHash(e.target.value as any)}
                />
              </div>
            </div>

            <Button
              onClick={handleVerify}
              disabled={verifyLoading}
              className="w-full h-11 text-sm font-semibold mt-2"
              icon={verifyLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
            >
              {verifyLoading ? 'Verifying Integrity...' : 'Verify Cryptographic Signature'}
            </Button>

            {verifyError && (
              <div className="p-4 rounded-xl bg-error/10 text-error border border-error/30 text-xs flex gap-2.5 items-start shadow-sm animate-fade-in">
                <ShieldAlert className="h-5 w-5 shrink-0 text-error mt-0.5" />
                <p className="leading-relaxed font-semibold">{verifyError}</p>
              </div>
            )}
          </div>

          {/* Right Verification Output */}
          <div className="space-y-4">
            <h2 className="text-base font-medium text-text-secondary">Verification Result</h2>

            {verificationResult !== null ? (
              <div className="animate-fade-in space-y-4">
                {verificationResult ? (
                  <div className="p-6 rounded-xl bg-success/10 border border-success/30 flex items-start gap-4 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                      <Check className="h-6 w-6 text-success animate-pulse-glow" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-success font-outfit">Signature is VALID</h3>
                      <p className="text-xs text-success/80 leading-relaxed mt-1">The payload data remains unaltered, and matches the private key signature. Visual integrity is verified.</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-xl bg-error/10 border border-error/30 flex items-start gap-4 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-error/20 flex items-center justify-center shrink-0">
                      <X className="h-6 w-6 text-error" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-error font-outfit">Signature is INVALID</h3>
                      <p className="text-xs text-error/80 leading-relaxed mt-1">Verification failed. Either the signature matches a different public key, the hashing algorithm is mismatching, or the payload content has been tampered with.</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[220px] rounded-xl bg-bg-tertiary border border-border border-dashed text-text-muted text-sm italic gap-2 p-6 text-center">
                <KeyRound className="h-8 w-8 opacity-30 animate-pulse-glow" />
                <div>
                  <p className="font-semibold text-text-secondary not-italic text-sm">Waiting for Verification</p>
                  <p className="text-xs text-text-muted max-w-xs mt-0.5">Fill public key, payload, and signature fields and click 'Verify' to test integrity.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
