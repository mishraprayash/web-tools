export interface ChmodPermissions {
  read: boolean;
  write: boolean;
  execute: boolean;
}

export interface ChmodState {
  owner: ChmodPermissions;
  group: ChmodPermissions;
  other: ChmodPermissions;
  special: {
    setuid: boolean;
    setgid: boolean;
    sticky: boolean;
  };
}

export type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Calculates symbolic representation and octal values from permission states.
 */
export function calculateOctalAndSymbolic(state: ChmodState): Result<{
  octal: string;
  symbolic: string;
  command: string;
}> {
  try {
    const calcDigit = (perms: ChmodPermissions): number => {
      let val = 0;
      if (perms.read) val += 4;
      if (perms.write) val += 2;
      if (perms.execute) val += 1;
      return val;
    };

    const ownerDigit = calcDigit(state.owner);
    const groupDigit = calcDigit(state.group);
    const otherDigit = calcDigit(state.other);

    let specialDigit = 0;
    if (state.special.setuid) specialDigit += 4;
    if (state.special.setgid) specialDigit += 2;
    if (state.special.sticky) specialDigit += 1;

    const octal = specialDigit > 0 
      ? `${specialDigit}${ownerDigit}${groupDigit}${otherDigit}`
      : `${ownerDigit}${groupDigit}${otherDigit}`;

    // Symbolic string (e.g. -rwxr-xr-x)
    // Format: [special-type][owner-rwx][group-rwx][other-rwx]
    // We omit the leading file-type character or default it to '-'
    const formatTriplet = (
      perms: ChmodPermissions,
      hasSetid: boolean,
      setidChar: 's' | 't',
      sticky: boolean = false
    ): string => {
      const r = perms.read ? 'r' : '-';
      const w = perms.write ? 'w' : '-';
      let x = perms.execute ? 'x' : '-';

      if (hasSetid) {
        x = perms.execute ? setidChar : setidChar.toUpperCase();
      } else if (sticky) {
        x = perms.execute ? 't' : 'T';
      }

      return `${r}${w}${x}`;
    };

    const ownerSym = formatTriplet(state.owner, state.special.setuid, 's');
    const groupSym = formatTriplet(state.group, state.special.setgid, 's');
    const otherSym = formatTriplet(state.other, false, 's', state.special.sticky);

    const symbolic = `${ownerSym}${groupSym}${otherSym}`;
    const command = `chmod ${octal} filename`;

    return {
      success: true,
      data: {
        octal,
        symbolic,
        command
      }
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error during chmod calculation'
    };
  }
}

/**
 * Parses an octal permission string (e.g., "755" or "4755") into a permission state.
 */
export function parseOctal(octalStr: string): Result<ChmodState> {
  try {
    const cleaned = octalStr.trim();
    if (!/^[0-7]{3,4}$/.test(cleaned)) {
      return {
        success: false,
        error: 'Invalid octal format. Must be 3 or 4 digits containing numbers from 0 to 7.'
      };
    }

    const hasSpecial = cleaned.length === 4;
    const specialVal = hasSpecial ? parseInt(cleaned[0], 10) : 0;
    const ownerVal = parseInt(cleaned[hasSpecial ? 1 : 0], 10);
    const groupVal = parseInt(cleaned[hasSpecial ? 2 : 1], 10);
    const otherVal = parseInt(cleaned[hasSpecial ? 3 : 2], 10);

    const parseDigit = (val: number): ChmodPermissions => ({
      read: (val & 4) !== 0,
      write: (val & 2) !== 0,
      execute: (val & 1) !== 0
    });

    return {
      success: true,
      data: {
        owner: parseDigit(ownerVal),
        group: parseDigit(groupVal),
        other: parseDigit(otherVal),
        special: {
          setuid: (specialVal & 4) !== 0,
          setgid: (specialVal & 2) !== 0,
          sticky: (specialVal & 1) !== 0
        }
      }
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to parse octal string'
    };
  }
}

/**
 * Parses a symbolic permission string (e.g., "rwxr-xr-x") into a permission state.
 */
export function parseSymbolic(symStr: string): Result<ChmodState> {
  try {
    const cleaned = symStr.trim().replace(/^[-d]/, ''); // Strip optional type identifier if present
    if (cleaned.length !== 9) {
      return {
        success: false,
        error: 'Symbolic permissions must be exactly 9 characters long (excluding file type).'
      };
    }

    const validateTriplet = (trip: string) => {
      return /^[r-][w-][xXsStT-]$/.test(trip);
    };

    const oTrip = cleaned.slice(0, 3);
    const gTrip = cleaned.slice(3, 6);
    const otTrip = cleaned.slice(6, 9);

    if (!validateTriplet(oTrip) || !validateTriplet(gTrip) || !validateTriplet(otTrip)) {
      return {
        success: false,
        error: 'Invalid symbolic pattern. Triplets must follow rwx format with optional s/S/t/T.'
      };
    }

    const parseTriplet = (trip: string, setidChar: 's' | 't' = 's'): { perms: ChmodPermissions; special: boolean } => {
      const read = trip[0] === 'r';
      const write = trip[1] === 'w';
      
      const xChar = trip[2];
      const execute = xChar === 'x' || xChar === setidChar || xChar === 't';
      const special = xChar === setidChar || xChar === setidChar.toUpperCase() || xChar === 't' || xChar === 'T';

      return {
        perms: { read, write, execute },
        special
      };
    };

    const ownerRes = parseTriplet(oTrip, 's');
    const groupRes = parseTriplet(gTrip, 's');
    const otherRes = parseTriplet(otTrip, 't');

    return {
      success: true,
      data: {
        owner: ownerRes.perms,
        group: groupRes.perms,
        other: otherRes.perms,
        special: {
          setuid: ownerRes.special,
          setgid: groupRes.special,
          sticky: otherRes.special
        }
      }
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to parse symbolic permissions'
    };
  }
}
