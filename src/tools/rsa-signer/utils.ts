function pemToBinary(pem: string, label: string): ArrayBuffer {
  const cleanPem = pem
    .replace(new RegExp(`-----BEGIN ${label}-----`), '')
    .replace(new RegExp(`-----END ${label}-----`), '')
    .replace(/\s+/g, '');
  
  const binaryString = atob(cleanPem);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function signPayloadRsa(
  privateKeyPem: string,
  payload: string,
  hashName: 'SHA-256' | 'SHA-384' | 'SHA-512' = 'SHA-256'
): Promise<string> {
  try {
    const pkcs8Buffer = pemToBinary(privateKeyPem.trim(), 'PRIVATE KEY');
    
    const privateKey = await crypto.subtle.importKey(
      'pkcs8',
      pkcs8Buffer,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: { name: hashName }
      },
      false,
      ['sign']
    );

    const encoder = new TextEncoder();
    const data = encoder.encode(payload);

    const signatureBuffer = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      privateKey,
      data
    );

    const signatureBytes = new Uint8Array(signatureBuffer);
    let binary = '';
    for (let i = 0; i < signatureBytes.length; i++) {
      binary += String.fromCharCode(signatureBytes[i]);
    }
    return btoa(binary); // Return Base64 encoded signature
  } catch (e) {
    throw new Error(`RSA Signature generation failed: ${(e as Error).message}`);
  }
}

export async function verifySignatureRsa(
  publicKeyPem: string,
  payload: string,
  signatureBase64: string,
  hashName: 'SHA-256' | 'SHA-384' | 'SHA-512' = 'SHA-256'
): Promise<boolean> {
  try {
    const spkiBuffer = pemToBinary(publicKeyPem.trim(), 'PUBLIC KEY');
    
    const publicKey = await crypto.subtle.importKey(
      'spki',
      spkiBuffer,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: { name: hashName }
      },
      false,
      ['verify']
    );

    const encoder = new TextEncoder();
    const data = encoder.encode(payload);

    const signatureBinaryString = atob(signatureBase64.trim().replace(/\s+/g, ''));
    const signatureBytes = new Uint8Array(signatureBinaryString.length);
    for (let i = 0; i < signatureBinaryString.length; i++) {
      signatureBytes[i] = signatureBinaryString.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      publicKey,
      signatureBytes,
      data
    );

    return isValid;
  } catch (e) {
    throw new Error(`RSA Signature verification failed: ${(e as Error).message}`);
  }
}
