export interface SvgToJsxOptions {
  componentName: string;
  typescript: boolean;
  forwardRef: boolean;
  dimensionMode: 'props' | 'icon' | 'original';
}

export interface ConversionResult {
  success: boolean;
  code: string;
  previewSvg: string;
  error?: string;
}

function parseStyleAttribute(styleStr: string): string {
  const declarations = styleStr.split(';').filter(Boolean);
  const rules = declarations.map(decl => {
    const parts = decl.split(':');
    const prop = parts[0]?.trim();
    const val = parts.slice(1).join(':')?.trim();
    if (!prop || !val) return '';
    // Camelcase CSS property names
    const camelProp = prop.replace(/-([a-z0-9])/gi, (_, char: string) => char.toUpperCase());
    return `${camelProp}: "${val.replace(/"/g, '\\"')}"`;
  }).filter(Boolean);

  return `style={{ ${rules.join(', ')} }}`;
}

export function svgToJsx(svgInput: string, options: Partial<SvgToJsxOptions> = {}): ConversionResult {
  const opts: SvgToJsxOptions = {
    componentName: 'SvgIcon',
    typescript: true,
    forwardRef: false,
    dimensionMode: 'props',
    ...options
  };

  const compName = opts.componentName.trim().replace(/[^a-zA-Z0-9_]/g, '') || 'SvgIcon';

  // Basic validation
  if (!svgInput.trim()) {
    return {
      success: false,
      code: '',
      previewSvg: '',
      error: 'Input SVG is empty'
    };
  }

  try {
    let cleaned = svgInput.trim();

    // 1. Strip XML header, doctype, and comments
    cleaned = cleaned.replace(/<\?xml[^>]*\?>/gi, '');
    cleaned = cleaned.replace(/<!DOCTYPE[^>]*>/gi, '');
    cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');
    cleaned = cleaned.trim();

    // Validate that it contains an <svg> tag
    if (!/<svg/i.test(cleaned)) {
      return {
        success: false,
        code: '',
        previewSvg: '',
        error: 'Could not find <svg> opening tag'
      };
    }

    // 2. Format SVG attributes to JSX equivalents
    // Replace class= with className=
    cleaned = cleaned.replace(/\bclass=/g, 'className=');

    // Replace inline style="..." with style={{...}}
    cleaned = cleaned.replace(/\bstyle="([^"]*)"/gi, (_, styleVal) => {
      return parseStyleAttribute(styleVal);
    });

    // Convert all other hyphenated attributes (like stroke-width) to camelCase
    cleaned = cleaned.replace(/\b([a-z0-9]+)-([a-z0-9\-]+)=/gi, (match, p1, p2) => {
      const camelPart = p2.replace(/-([a-z0-9])/gi, (_: unknown, char: string) => char.toUpperCase());
      const firstLetter = p1 + camelPart.charAt(0).toUpperCase() + camelPart.slice(1);
      return `${firstLetter}=`;
    });

    // Create the visual preview SVG
    // Keep it self-contained and clean
    const previewSvg = cleaned;

    // 3. Process the opening SVG tag to handle ref and props
    const svgTagRegex = /<svg([^>]*)>/i;
    const match = cleaned.match(svgTagRegex);

    if (!match) {
      return {
        success: false,
        code: '',
        previewSvg,
        error: 'Malformed <svg> tag structure'
      };
    }

    let svgAttrs = match[1];

    // Extract original dimensions if needed
    const widthMatch = svgAttrs.match(/\bwidth="([^"]*)"/i);
    const heightMatch = svgAttrs.match(/\bheight="([^"]*)"/i);
    const originalWidth = widthMatch ? widthMatch[0] : '';
    const originalHeight = heightMatch ? heightMatch[0] : '';

    // Strip width/height from the generic attributes buffer
    svgAttrs = svgAttrs.replace(/\b(width|height)="[^"]*"/gi, '');
    svgAttrs = svgAttrs.replace(/\s+/g, ' ').trim();

    let assembledSvgTag = '<svg';
    if (svgAttrs) {
      assembledSvgTag += ` ${svgAttrs}`;
    }

    // Append width and height based on option
    if (opts.dimensionMode === 'icon') {
      assembledSvgTag += ' width="1em" height="1em"';
    } else if (opts.dimensionMode === 'original') {
      if (originalWidth) assembledSvgTag += ` ${originalWidth}`;
      if (originalHeight) assembledSvgTag += ` ${originalHeight}`;
    }

    // Append props and ref
    if (opts.forwardRef) {
      assembledSvgTag += ' ref={ref} {...props}';
    } else {
      assembledSvgTag += ' {...props}';
    }
    assembledSvgTag += '>';

    // Replace the original <svg> tag with our custom assembled tag
    cleaned = cleaned.replace(svgTagRegex, assembledSvgTag);

    // Indent the output code nicely (simple padding)
    const indentedContent = cleaned
      .split('\n')
      .map(line => `    ${line}`)
      .join('\n');

    // 4. Wrap inside a React functional component
    let finalCode = '';
    const exportKw = 'export ';

    if (opts.typescript) {
      if (opts.forwardRef) {
        finalCode = `import * as React from 'react';

${exportKw}const ${compName} = React.forwardRef<SVGSVGElement, React.ComponentPropsWithoutRef<'svg'>>((props, ref) => (
${indentedContent}
));

${compName}.displayName = '${compName}';
`;
      } else {
        finalCode = `import * as React from 'react';

${exportKw}function ${compName}(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
${indentedContent}
  );
}
`;
      }
    } else {
      if (opts.forwardRef) {
        finalCode = `import * as React from 'react';

${exportKw}const ${compName} = React.forwardRef((props, ref) => (
${indentedContent}
));

${compName}.displayName = '${compName}';
`;
      } else {
        finalCode = `import * as React from 'react';

${exportKw}function ${compName}(props) {
  return (
${indentedContent}
  );
}
`;
      }
    }

    return {
      success: true,
      code: finalCode,
      previewSvg
    };
  } catch (e) {
    return {
      success: false,
      code: '',
      previewSvg: '',
      error: `Conversion error: ${(e as Error).message}`
    };
  }
}
