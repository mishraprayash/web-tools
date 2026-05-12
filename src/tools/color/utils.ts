export type ColorFormat = 'hex' | 'rgb' | 'hsl';

export interface RgbColor { r: number; g: number; b: number }
export interface HslColor { h: number; s: number; l: number }

type ConvertResult = { success: true; hex: string; rgb: string; hsl: string } | { success: false; error: string };

export function parseHex(input: string): RgbColor | null {
  const cleaned = input.trim().replace(/^#/, '');
  if (cleaned.length === 3) {
    const [r, g, b] = cleaned;
    return { r: parseInt(r + r, 16), g: parseInt(g + g, 16), b: parseInt(b + b, 16) };
  }
  if (cleaned.length === 6) {
    const result = /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/.exec(cleaned);
    if (!result) return null;
    return { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) };
  }
  return null;
}

export function parseRgb(input: string): RgbColor | null {
  const m = /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i.exec(input.trim());
  if (!m) return null;
  const [r, g, b] = [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
  if (r > 255 || g > 255 || b > 255) return null;
  return { r, g, b };
}

export function parseHsl(input: string): HslColor | null {
  const m = /^hsl\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/i.exec(input.trim());
  if (!m) return null;
  const [h, s, l] = [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
  if (h > 360 || s > 100 || l > 100) return null;
  return { h, s, l };
}

export function rgbToHex({ r, g, b }: RgbColor): string {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

export function rgbToHsl({ r, g, b }: RgbColor): HslColor {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255];
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
  else if (max === gn) h = ((bn - rn) / d + 2) * 60;
  else h = ((rn - gn) / d + 4) * 60;
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToRgb({ h, s, l }: HslColor): RgbColor {
  const sNorm = s / 100;
  const lNorm = l / 100;
  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;
  let [r, g, b] = [0, 0, 0];
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
}

export function formatRgb({ r, g, b }: RgbColor): string {
  return `rgb(${r}, ${g}, ${b})`;
}

export function formatHsl({ h, s, l }: HslColor): string {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function convertColor(input: string): ConvertResult {
  const hex = parseHex(input);
  if (hex) {
    const rgb = hex;
    const hsl = rgbToHsl(rgb);
    return { success: true, hex: rgbToHex(rgb), rgb: formatRgb(rgb), hsl: formatHsl(hsl) };
  }
  const rgb = parseRgb(input);
  if (rgb) {
    const hsl = rgbToHsl(rgb);
    return { success: true, hex: rgbToHex(rgb), rgb: formatRgb(rgb), hsl: formatHsl(hsl) };
  }
  const hsl = parseHsl(input);
  if (hsl) {
    const rgb = hslToRgb(hsl);
    return { success: true, hex: rgbToHex(rgb), rgb: formatRgb(rgb), hsl: formatHsl(hsl) };
  }
  return { success: false, error: 'Invalid colour format. Try hex (#ff6600), rgb(255,102,0) or hsl(24,100%,50%)' };
}
