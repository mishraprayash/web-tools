'use server';

export type TargetLanguage = 
  | 'javascript-fetch'
  | 'javascript-axios'
  | 'python'
  | 'go'
  | 'rust'
  | 'php'
  | 'java'
  | 'ruby';

export interface CurlConverterResult {
  success: boolean;
  code?: string;
  error?: string;
}

export async function convertCurl(curlCommand: string, target: TargetLanguage): Promise<CurlConverterResult> {
  if (!curlCommand || !curlCommand.trim().startsWith('curl')) {
    return { success: false, error: 'Input must be a valid cURL command starting with "curl"' };
  }

  try {
    const converter = await import('curlconverter');
    
    let code = '';
    switch (target) {
      case 'javascript-fetch':
        code = converter.toJavaScript(curlCommand);
        break;
      case 'javascript-axios':
        code = converter.toNodeAxios(curlCommand);
        break;
      case 'python':
        code = converter.toPython(curlCommand);
        break;
      case 'go':
        code = converter.toGo(curlCommand);
        break;
      case 'rust':
        code = converter.toRust(curlCommand);
        break;
      case 'php':
        code = converter.toPhp(curlCommand);
        break;
      case 'java':
        code = converter.toJava(curlCommand);
        break;
      case 'ruby':
        code = converter.toRuby(curlCommand);
        break;
      default:
        code = converter.toJavaScript(curlCommand);
    }
    
    return { success: true, code };
  } catch (error) {
    return { 
      success: false, 
      error: `Failed to parse cURL command: ${(error as Error).message}` 
    };
  }
}
