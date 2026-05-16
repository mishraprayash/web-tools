export type FileReadResult =
  | { success: true; dataUrl: string; fileName: string; fileSize: number; mimeType: string }
  | { success: false; error: string };

export function fileToBase64(file: File): Promise<FileReadResult> {
  return new Promise((resolve) => {
    if (file.size === 0) {
      resolve({ success: false, error: 'File is empty' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve({
        success: true,
        dataUrl: result,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      });
    };
    reader.onerror = () => resolve({ success: false, error: (reader.error as Error).message || 'Failed to read file' });
    reader.readAsDataURL(file);
  });
}

export function stripDataUrlPrefix(dataUrl: string): string {
  const commaIndex = dataUrl.indexOf(',');
  return commaIndex !== -1 ? dataUrl.slice(commaIndex + 1) : dataUrl;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
