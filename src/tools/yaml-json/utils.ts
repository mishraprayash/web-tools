type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export function jsonToYaml(json: string): string {
  let obj: JsonValue;
  try { obj = JSON.parse(json); }
  catch { return 'Invalid JSON'; }

  const serialize = (val: JsonValue, indent: number): string => {
    const pad = '  '.repeat(indent);
    if (val === null) return 'null';
    if (typeof val === 'string') {
      return val.includes(': ') || val.includes('#') ? `"${val}"` : val;
    }
    if (typeof val === 'number' || typeof val === 'boolean') return String(val);
    if (Array.isArray(val)) {
      if (val.length === 0) return '[]';
      return '\n' + val.map((item) => {
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          return pad + '- ' + serialize(item, indent + 1).trimStart();
        }
        return pad + '- ' + serialize(item, indent + 1).trim();
      }).join('\n');
    }
    const keys = Object.keys(val);
    if (keys.length === 0) return '{}';
    return '\n' + keys.map((k) => {
      const v = val[k];
      if (typeof v === 'object' && v !== null) {
        return pad + k + ':' + serialize(v, indent + 1);
      }
      return pad + k + ': ' + serialize(v, indent + 1);
    }).join('\n');
  };

  return serialize(obj, 0).trim();
}

function yamlParseLines(lines: string[], start: number, indent: number): { result: JsonValue; consumed: number } {
  let i = start;
  const obj: { [key: string]: JsonValue } = {};
  const arr: JsonValue[] = [];
  let isArray = false;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) { i++; continue; }

    const currentIndent = line.search(/\S/);
    if (currentIndent < indent) break;
    if (currentIndent > indent) { i++; continue; }

    // Array item
    const arrMatch = trimmed.match(/^-\s+(.*)/);
    if (arrMatch) {
      isArray = true;
      const rest = arrMatch[1];
      if (!rest || rest === '|' || rest === '>') {
        const nested = yamlParseLines(lines, i + 1, currentIndent + 2);
        arr.push(nested.result);
        i = nested.consumed;
      } else if (rest === '{}') { arr.push({}); i++; }
      else if (rest === '[]') { arr.push([]); i++; }
      else if (rest === 'null' || rest === '~') { arr.push(null); i++; }
      else if (rest === 'true') { arr.push(true); i++; }
      else if (rest === 'false') { arr.push(false); i++; }
      else if (/^-?\d+\.\d+$/.test(rest)) { arr.push(parseFloat(rest)); i++; }
      else if (/^-?\d+$/.test(rest)) { arr.push(parseInt(rest, 10)); i++; }
      else {
        const str = rest.startsWith('"') && rest.endsWith('"') ? rest.slice(1, -1) : rest;
        arr.push(str);
        i++;
      }
      continue;
    }

    // Key-value pair
    const kvMatch = trimmed.match(/^([^:]+):\s*(.*)/);
    if (kvMatch) {
      const key = kvMatch[1].trim();
      const value = kvMatch[2].trim();

      if (value === '' || value === '|' || value === '>') {
        const nested = yamlParseLines(lines, i + 1, currentIndent + 2);
        obj[key] = nested.result;
        i = nested.consumed;
      } else if (value === 'null' || value === '~') { obj[key] = null; i++; }
      else if (value === 'true') { obj[key] = true; i++; }
      else if (value === 'false') { obj[key] = false; i++; }
      else if (/^-?\d+\.\d+$/.test(value)) { obj[key] = parseFloat(value); i++; }
      else if (/^-?\d+$/.test(value)) { obj[key] = parseInt(value, 10); i++; }
      else {
        const str = (value.startsWith('"') && value.endsWith('"')) ? value.slice(1, -1) : value;
        obj[key] = str;
        i++;
      }
      continue;
    }

    i++;
  }

  return { result: isArray ? arr : obj, consumed: i };
}

export function yamlToJson(yaml: string): string {
  try {
    const lines = yaml.split('\n');
    const { result } = yamlParseLines(lines, 0, 0);
    return JSON.stringify(result, null, 2);
  } catch {
    return 'Invalid YAML';
  }
}
