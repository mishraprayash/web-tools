'use client';

import * as React from 'react';
import { ToolLayout } from '@/components/tool/ToolLayout';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { fileToBase64, stripDataUrlPrefix, formatFileSize, type FileReadResult } from '@/tools/image-base64/utils';
import { ImageUp, Trash2, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Page() {
  const [result, setResult] = React.useState<FileReadResult | null>(null);
  const [rawMode, setRawMode] = React.useState(false);
  const [dragOver, setDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = React.useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setResult({ success: false, error: 'Please select an image file' });
      return;
    }
    const res = await fileToBase64(file);
    setResult(res);
  }, []);

  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = React.useCallback(() => setDragOver(false), []);

  const handleClear = React.useCallback(() => {
    setResult(null);
    setRawMode(false);
    if (inputRef.current) inputRef.current.value = '';
  }, []);

  const base64Content = result?.success
    ? (rawMode ? stripDataUrlPrefix(result.dataUrl) : result.dataUrl)
    : '';

  return (
    <ToolLayout name="Image to Base64" description="Convert images to base64 data URLs" category="Encoding">
      <div className="space-y-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          className="hidden"
        />

        {!result ? (
          <button
            onClick={() => inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              'w-full p-10 rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer',
              dragOver
                ? 'border-accent bg-accent/5'
                : 'border-border hover:border-accent/50 hover:bg-bg-tertiary'
            )}
          >
            <div className={cn('p-4 rounded-xl transition-colors', dragOver ? 'bg-accent/10' : 'bg-bg-tertiary')}>
              <ImageUp className={cn('h-10 w-10 transition-colors', dragOver ? 'text-accent' : 'text-text-muted')} />
            </div>
            <p className="text-text-primary font-medium">Click to upload or drag & drop</p>
            <p className="text-text-muted text-sm">PNG, JPG, WebP, SVG, GIF — any image format</p>
          </button>
        ) : (
          <div className="space-y-4">
            {result.success ? (
              <>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-bg-tertiary border border-border">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-bg-secondary shrink-0 border border-border">
                    <img src={result.dataUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary font-medium truncate">{result.fileName}</p>
                    <p className="text-xs text-text-muted mt-0.5">{result.mimeType} · {formatFileSize(result.fileSize)}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleClear} icon={<Trash2 className="h-4 w-4" />}>
                    Remove
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={rawMode ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setRawMode(false)}
                  >
                    Data URL
                  </Button>
                  <Button
                    variant={rawMode ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => setRawMode(true)}
                  >
                    Raw Base64
                  </Button>
                  <span className="text-xs text-text-muted ml-auto">
                    {base64Content.length.toLocaleString()} chars
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    readOnly
                    value={base64Content}
                    className="w-full h-60 px-4 py-3 rounded-lg bg-bg-tertiary border border-border text-text-primary font-mono text-xs focus:outline-none resize-y"
                  />
                  <CopyButton value={base64Content} label="Copy" className="absolute top-2 right-2" />
                </div>
              </>
            ) : (
              <div className="p-5 rounded-xl bg-error/10 border border-error/30">
                <p className="text-sm text-error font-medium">Error</p>
                <p className="text-sm text-text-secondary mt-1">{result.error}</p>
                <Button variant="secondary" size="sm" onClick={handleClear} className="mt-3">
                  Try again
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="p-5 rounded-xl bg-bg-secondary border border-border">
          <h3 className="text-sm font-medium mb-2">About</h3>
          <ul className="space-y-1.5 text-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-text-muted mt-0.5 shrink-0" />
              <span>Data URL format: <code className="font-mono text-xs">data:image/png;base64,iVBOR...</code></span>
            </li>
            <li className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-text-muted mt-0.5 shrink-0" />
              <span>Raw base64 strips the <code className="font-mono text-xs">data:...;base64,</code> prefix</span>
            </li>
            <li className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-text-muted mt-0.5 shrink-0" />
              <span>All processing happens in your browser — nothing is uploaded to any server</span>
            </li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
