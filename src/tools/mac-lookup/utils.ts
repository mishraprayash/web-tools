export interface MacLookupResult {
  macAddress: string;
  formatted: string;
  oui: string;
  vendor: string;
  transmissionType: 'Unicast' | 'Multicast';
  administrationType: 'Universally Administered (UAA)' | 'Locally Administered (LAA)';
}

export type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

// Basic offline OUI vendor map for common manufacturers
const COMMON_VENDORS: Record<string, string> = {
  '00:00:5E': 'ICANN/IANA',
  '00:05:9A': 'Cisco Systems',
  '00:0C:29': 'VMware',
  '00:15:5D': 'Microsoft',
  '00:1A:11': 'Google',
  '00:1C:42': 'Parallels',
  '00:50:56': 'VMware',
  '3C:5A:B4': 'Google',
  '3C:D9:2B': 'Hewlett Packard',
  '48:2C:A0': 'Ubiquiti Networks',
  '54:AF:97': 'Apple',
  '70:8B:CD': 'ASUSTek Computer',
  '74:81:14': 'Apple',
  '7C:8B:CA': 'Apple',
  '8C:85:90': 'Apple',
  'A4:77:33': 'Xiaomi Communications',
  'B4:F6:1C': 'Samsung Electronics',
  'BC:5F:F4': 'ASUSTek Computer',
  'C0:56:27': 'Apple',
  'CC:46:D6': 'Cisco Systems',
  'D8:3C:99': 'Apple',
  'E0:27:1A': 'Intel Corporation',
  'E4:E0:A6': 'Huawei Technologies',
  'F8:FF:C2': 'Apple',
};

export function lookupMacAddress(macStr: string): Result<MacLookupResult> {
  try {
    const cleaned = macStr.replace(/[^a-fA-F0-9]/g, '');
    if (cleaned.length !== 12) {
      return {
        success: false,
        error: 'Invalid MAC address. Must contain exactly 12 hexadecimal characters.'
      };
    }

    // Split into pairs and format with colons
    const pairs: string[] = [];
    for (let i = 0; i < 12; i += 2) {
      pairs.push(cleaned.slice(i, i + 2).toUpperCase());
    }
    const formatted = pairs.join(':');
    const oui = pairs.slice(0, 3).join(':');

    // Transmission type (determined by the least significant bit of the first octet)
    // Multicast if bit is 1, Unicast if bit is 0
    const firstOctetVal = parseInt(pairs[0], 16);
    const transmissionType = (firstOctetVal & 1) === 1 ? 'Multicast' : 'Unicast';

    // Administration type (determined by the second-least significant bit of the first octet)
    // Locally administered if bit is 1, Universally administered if bit is 0
    const administrationType = (firstOctetVal & 2) === 2
      ? 'Locally Administered (LAA)'
      : 'Universally Administered (UAA)';

    // Lookup vendor
    const vendor = COMMON_VENDORS[oui] || 'Unknown / Unregistered Vendor';

    return {
      success: true,
      data: {
        macAddress: macStr,
        formatted,
        oui,
        vendor,
        transmissionType,
        administrationType
      }
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown MAC lookup error'
    };
  }
}
