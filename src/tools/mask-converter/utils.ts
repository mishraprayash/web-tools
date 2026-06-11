export interface MaskConversion {
  cidr: number;
  subnetMask: string;
  wildcardMask: string;
  totalHosts: number;
}

export type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

function longToIp(long: number): string {
  return [
    (long >>> 24) & 255,
    (long >>> 16) & 255,
    (long >>> 8) & 255,
    long & 255
  ].join('.');
}

function ipToLong(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

export function fromCidr(cidrVal: number): Result<MaskConversion> {
  if (cidrVal < 0 || cidrVal > 32) {
    return { success: false, error: 'CIDR prefix must be between 0 and 32.' };
  }
  const maskLong = cidrVal === 0 ? 0 : (~0 << (32 - cidrVal)) >>> 0;
  const subnetMask = longToIp(maskLong);
  const wildcardMask = longToIp((~maskLong) >>> 0);
  const totalHosts = Math.pow(2, 32 - cidrVal);

  return {
    success: true,
    data: {
      cidr: cidrVal,
      subnetMask,
      wildcardMask,
      totalHosts
    }
  };
}

export function fromSubnetMask(maskStr: string): Result<MaskConversion> {
  try {
    const clean = maskStr.trim();
    const ipPattern = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipPattern.test(clean)) {
      return { success: false, error: 'Invalid IPv4 Subnet Mask format.' };
    }

    const maskLong = ipToLong(clean);
    
    // Validate that mask is contiguous set of 1s followed by 0s
    // Check if (maskLong & (maskLong - 1)) pattern is correct
    // For a subnet mask, ~maskLong + 1 should be a power of 2
    const inverted = (~maskLong) >>> 0;
    const isContiguous = (inverted & (inverted + 1)) === 0;

    if (!isContiguous && maskLong !== 0) {
      return { success: false, error: 'Non-contiguous subnet masks are invalid.' };
    }

    // Determine CIDR value
    // Count consecutive leading 1s
    const binary = maskLong.toString(2);
    const cidr = maskLong === 0 ? 0 : binary.indexOf('0') === -1 ? 32 : binary.indexOf('0');
    
    const wildcardMask = longToIp(inverted);
    const totalHosts = Math.pow(2, 32 - cidr);

    return {
      success: true,
      data: {
        cidr,
        subnetMask: clean,
        wildcardMask,
        totalHosts
      }
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Subnet conversion failed.'
    };
  }
}

export function fromWildcardMask(wildcardStr: string): Result<MaskConversion> {
  try {
    const clean = wildcardStr.trim();
    const ipPattern = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipPattern.test(clean)) {
      return { success: false, error: 'Invalid Wildcard Mask format.' };
    }

    const wildcardLong = ipToLong(clean);
    const maskLong = (~wildcardLong) >>> 0;
    
    const inverted = (~maskLong) >>> 0;
    const isContiguous = (inverted & (inverted + 1)) === 0;

    if (!isContiguous && maskLong !== 0) {
      return { success: false, error: 'Invalid wildcard mask bounds.' };
    }

    const binary = maskLong.toString(2);
    const cidr = maskLong === 0 ? 0 : binary.indexOf('0') === -1 ? 32 : binary.indexOf('0');
    
    const subnetMask = longToIp(maskLong);
    const totalHosts = Math.pow(2, 32 - cidr);

    return {
      success: true,
      data: {
        cidr,
        subnetMask,
        wildcardMask: clean,
        totalHosts
      }
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Wildcard conversion failed.'
    };
  }
}
export { };
