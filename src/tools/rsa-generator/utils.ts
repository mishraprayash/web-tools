export interface KeypairOptions {
  keySize: 1024 | 2048 | 4096;
  hashAlgorithm: 'SHA-256' | 'SHA-384' | 'SHA-512';
}

export interface GeneratedKeypair {
  publicKey: string;
  privateKey: string;
}

function convertBinaryToPem(binaryBuffer: ArrayBuffer, label: string): string {
  const bytes = new Uint8Array(binaryBuffer);
  let binaryString = '';
  // Convert in chunks to avoid call stack limits for large keys
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binaryString += String.fromCharCode.apply(
      null,
      bytes.subarray(i, i + chunkSize) as any
    );
  }
  const base64String = btoa(binaryString);
  const lines = base64String.match(/.{1,64}/g) || [];
  return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----`;
}

export async function generateRsaKeypair(options: KeypairOptions): Promise<GeneratedKeypair> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: options.keySize,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: { name: options.hashAlgorithm }
    },
    true,
    ['sign', 'verify']
  );

  const exportedSpki = await crypto.subtle.exportKey('spki', keyPair.publicKey);
  const publicKeyPem = convertBinaryToPem(exportedSpki, 'PUBLIC KEY');

  const exportedPkcs8 = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
  const privateKeyPem = convertBinaryToPem(exportedPkcs8, 'PRIVATE KEY');

  return {
    publicKey: publicKeyPem,
    privateKey: privateKeyPem
  };
}
