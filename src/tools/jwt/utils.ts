export interface JWTPayload {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  raw: { header: string; payload: string; signature: string };
}

export type JWTStatus = 'valid' | 'expired' | 'invalid';

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;

    const header = JSON.parse(atob(headerB64.replace(/-/g, '+').replace(/_/g, '/')));
    const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));

    return {
      header,
      payload,
      signature: signatureB64,
      raw: {
        header: headerB64,
        payload: payloadB64,
        signature: signatureB64,
      },
    };
  } catch {
    return null;
  }
}

export function getJWTStatus(token: string): JWTStatus {
  const decoded = decodeJWT(token);
  if (!decoded) return 'invalid';

  const exp = decoded.payload.exp;
  if (typeof exp === 'number') {
    return Date.now() / 1000 > exp ? 'expired' : 'valid';
  }
  return 'valid';
}

export function getJWTExpiryDate(token: string): Date | null {
  const decoded = decodeJWT(token);
  if (!decoded) return null;

  const exp = decoded.payload.exp;
  if (typeof exp === 'number') {
    return new Date(exp * 1000);
  }
  return null;
}

export function getJWTIssuedAt(token: string): Date | null {
  const decoded = decodeJWT(token);
  if (!decoded) return null;

  const iat = decoded.payload.iat;
  if (typeof iat === 'number') {
    return new Date(iat * 1000);
  }
  return null;
}