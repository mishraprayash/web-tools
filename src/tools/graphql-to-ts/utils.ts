export function gqlToTs(gql: string): { success: true; data: string } | { success: false; error: string } {
  try {
    if (!gql.trim()) {
      return { success: true, data: '' };
    }

    let ts = '';
    
    // Remove comments
    const cleanGql = gql.replace(/#.*$/gm, '');

    // Extract Enums
    const enumRegex = /enum\s+(\w+)\s*{([^}]+)}/g;
    let match;
    while ((match = enumRegex.exec(cleanGql)) !== null) {
      const name = match[1];
      const values = match[2].trim().split(/[\s,]+/).filter(Boolean);
      ts += `export enum ${name} {\n`;
      values.forEach(v => ts += `  ${v} = '${v}',\n`);
      ts += `}\n\n`;
    }

    // Extract Types/Inputs/Interfaces
    const typeRegex = /(?:type|input|interface)\s+(\w+)\s*{([^}]+)}/g;
    while ((match = typeRegex.exec(cleanGql)) !== null) {
      const name = match[1];
      const fieldsStr = match[2];
      ts += `export interface ${name} {\n`;
      
      const fieldRegex = /(\w+)\s*:\s*(\[?[A-Za-z0-9_!]+\]?!?)/g;
      let fieldMatch;
      while ((fieldMatch = fieldRegex.exec(fieldsStr)) !== null) {
        const fieldName = fieldMatch[1];
        const fieldTypeRaw = fieldMatch[2];
        
        const isArray = fieldTypeRaw.includes('[');
        const isRequired = fieldTypeRaw.endsWith('!');
        const innerTypeMatch = fieldTypeRaw.match(/[A-Za-z0-9_]+/g);
        
        // innerTypeMatch will have the actual type name
        let innerType = innerTypeMatch ? innerTypeMatch[innerTypeMatch.length - 1] : 'any';
        
        // Map standard GraphQL scalars to TS types
        if (innerType === 'String' || innerType === 'ID') innerType = 'string';
        else if (innerType === 'Int' || innerType === 'Float') innerType = 'number';
        else if (innerType === 'Boolean') innerType = 'boolean';
        
        const tsType = isArray ? `${innerType}[]` : innerType;
        const optionalMark = isRequired ? '' : '?';
        
        ts += `  ${fieldName}${optionalMark}: ${tsType};\n`;
      }
      ts += `}\n\n`;
    }

    const finalOutput = ts.trim();
    if (!finalOutput) {
       return { success: true, data: '// No valid GraphQL type, input, interface, or enum definitions found.' };
    }

    return { success: true, data: finalOutput };
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : 'Unknown parsing error' };
  }
}
