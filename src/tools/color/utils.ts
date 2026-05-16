export type ColorFormat = 'hex' | 'hexa' | 'rgb' | 'rgba' | 'hsl' | 'hsla';

export interface RgbColor { r: number; g: number; b: number; a: number }
export interface HslColor { h: number; s: number; l: number; a: number }

export interface HarmonyColor {
  name: string;
  hex: string;
  hsl: string;
}

export interface ColorInfo {
  hex: string;
  hexa: string;
  rgb: string;
  rgba: string;
  hsl: string;
  hsla: string;
  r: number;
  g: number;
  b: number;
  h: number;
  s: number;
  l: number;
  a: number;
  luminance: number;
  contrastOnWhite: number;
  contrastOnBlack: number;
  harmonies: HarmonyColor[];
}

export type ConvertResult =
  | ({ success: true } & ColorInfo)
  | { success: false; error: string };

export function parseHex(input: string): RgbColor | null {
  const cleaned = input.trim().replace(/^#/, '');
  if (cleaned.length === 3) {
    const [r, g, b] = cleaned;
    return { r: parseInt(r + r, 16), g: parseInt(g + g, 16), b: parseInt(b + b, 16), a: 1 };
  }
  if (cleaned.length === 4) {
    const [r, g, b, a] = cleaned;
    return {
      r: parseInt(r + r, 16), g: parseInt(g + g, 16), b: parseInt(b + b, 16),
      a: Math.round((parseInt(a + a, 16) / 255) * 100) / 100,
    };
  }
  if (cleaned.length === 6) {
    const m = /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/.exec(cleaned);
    if (!m) return null;
    return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16), a: 1 };
  }
  if (cleaned.length === 8) {
    const m = /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/.exec(cleaned);
    if (!m) return null;
    return {
      r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16),
      a: Math.round((parseInt(m[4], 16) / 255) * 100) / 100,
    };
  }
  return null;
}

export function parseRgb(input: string): RgbColor | null {
  const cleaned = input.trim();

  const comma = /^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/i.exec(cleaned);
  if (comma) {
    const [r, g, b, a] = [parseInt(comma[1]), parseInt(comma[2]), parseInt(comma[3]), comma[4] !== undefined ? parseFloat(comma[4]) : 1];
    if (r > 255 || g > 255 || b > 255 || a > 1 || a < 0) return null;
    return { r, g, b, a };
  }

  const space = /^rgba?\s*\(\s*(\d+)\s+(\d+)\s+(\d+)(?:\s*\/\s*([\d.]+))?\s*\)$/i.exec(cleaned);
  if (space) {
    const [r, g, b, a] = [parseInt(space[1]), parseInt(space[2]), parseInt(space[3]), space[4] !== undefined ? parseFloat(space[4]) : 1];
    if (r > 255 || g > 255 || b > 255 || a > 1 || a < 0) return null;
    return { r, g, b, a };
  }

  return null;
}

export function parseHsl(input: string): HslColor | null {
  const cleaned = input.trim();

  const comma = /^hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%(?:\s*,\s*([\d.]+))?\s*\)$/i.exec(cleaned);
  if (comma) {
    const [h, s, l, a] = [parseInt(comma[1]), parseInt(comma[2]), parseInt(comma[3]), comma[4] !== undefined ? parseFloat(comma[4]) : 1];
    if (h > 360 || s > 100 || l > 100 || a > 1 || a < 0) return null;
    return { h, s, l, a };
  }

  const space = /^hsla?\s*\(\s*(\d+)\s+(\d+)%\s+(\d+)%(?:\s*\/\s*([\d.]+))?\s*\)$/i.exec(cleaned);
  if (space) {
    const [h, s, l, a] = [parseInt(space[1]), parseInt(space[2]), parseInt(space[3]), space[4] !== undefined ? parseFloat(space[4]) : 1];
    if (h > 360 || s > 100 || l > 100 || a > 1 || a < 0) return null;
    return { h, s, l, a };
  }

  return null;
}

export function rgbToHex({ r, g, b }: RgbColor): string {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

export function rgbToHexa({ r, g, b, a }: RgbColor): string {
  const alpha = Math.round(a * 255).toString(16).padStart(2, '0');
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('') + alpha;
}

export function rgbToHsl({ r, g, b }: RgbColor): HslColor {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255];
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100), a: 1 };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
  else if (max === gn) h = ((bn - rn) / d + 2) * 60;
  else h = ((rn - gn) / d + 4) * 60;
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100), a: 1 };
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
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255), a: 1 };
}

export function formatRgb({ r, g, b }: RgbColor): string {
  return `rgb(${r}, ${g}, ${b})`;
}

export function formatRgba({ r, g, b, a }: RgbColor): string {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function formatHsl({ h, s, l }: HslColor): string {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function formatHsla({ h, s, l, a }: HslColor): string {
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
}

export function calculateLuminance({ r, g, b }: RgbColor): number {
  const toLinear = (v: number): number => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function calculateContrast(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100;
}

export function getHarmonies({ h, s, l }: HslColor): HarmonyColor[] {
  const wrap = (v: number) => ((v % 360) + 360) % 360;

  const fromHsl = (hue: number, name: string): HarmonyColor => {
    const hsl = { h: wrap(hue), s, l, a: 1 };
    const rgb = hslToRgb(hsl);
    return { name, hex: rgbToHex(rgb), hsl: formatHsl(hsl) };
  };

  return [
    fromHsl(h + 180, 'Complementary'),
    fromHsl(h + 30, 'Analogous'),
    fromHsl(h - 30, 'Analogous'),
    fromHsl(h + 120, 'Triadic'),
    fromHsl(h + 240, 'Triadic'),
    fromHsl(h + 150, 'Split Complementary'),
    fromHsl(h + 210, 'Split Complementary'),
  ];
}

export function convertColor(input: string): ConvertResult {
  const hex = parseHex(input);
  if (hex) {
    const hsl = rgbToHsl(hex);
    const { r, g, b, a } = hex;
    const luminance = calculateLuminance(hex);
    return {
      success: true,
      hex: rgbToHex(hex),
      hexa: rgbToHexa(hex),
      rgb: formatRgb(hex),
      rgba: formatRgba(hex),
      hsl: formatHsl(hsl),
      hsla: formatHsla({ ...hsl, a }),
      r, g, b, h: hsl.h, s: hsl.s, l: hsl.l, a,
      luminance: Math.round(luminance * 1000) / 1000,
      contrastOnWhite: calculateContrast(luminance, 1),
      contrastOnBlack: calculateContrast(luminance, 0),
      harmonies: getHarmonies(hsl),
    };
  }

  const rgb = parseRgb(input);
  if (rgb) {
    const hsl = rgbToHsl(rgb);
    const { r, g, b, a } = rgb;
    const luminance = calculateLuminance(rgb);
    return {
      success: true,
      hex: rgbToHex(rgb),
      hexa: rgbToHexa(rgb),
      rgb: formatRgb(rgb),
      rgba: formatRgba(rgb),
      hsl: formatHsl(hsl),
      hsla: formatHsla({ ...hsl, a }),
      r, g, b, h: hsl.h, s: hsl.s, l: hsl.l, a,
      luminance: Math.round(luminance * 1000) / 1000,
      contrastOnWhite: calculateContrast(luminance, 1),
      contrastOnBlack: calculateContrast(luminance, 0),
      harmonies: getHarmonies(hsl),
    };
  }

  const hsl = parseHsl(input);
  if (hsl) {
    const rgb = hslToRgb(hsl);
    const { h, s, l, a } = hsl;
    const luminance = calculateLuminance(rgb);
    return {
      success: true,
      hex: rgbToHex(rgb),
      hexa: rgbToHexa(rgb),
      rgb: formatRgb(rgb),
      rgba: formatRgba(rgb),
      hsl: formatHsl(hsl),
      hsla: formatHsla(hsl),
      r: rgb.r, g: rgb.g, b: rgb.b, h, s, l, a,
      luminance: Math.round(luminance * 1000) / 1000,
      contrastOnWhite: calculateContrast(luminance, 1),
      contrastOnBlack: calculateContrast(luminance, 0),
      harmonies: getHarmonies(hsl),
    };
  }

  return { success: false, error: 'Invalid colour format. Try hex (#ff6600), rgb(255, 102, 0), hsl(24, 100%, 50%), or rgba/hsla with alpha.' };
}
