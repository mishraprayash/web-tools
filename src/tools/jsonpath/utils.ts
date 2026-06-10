import { JSONPath } from 'jsonpath-plus';

export function evaluateJsonPath(jsonString: string, path: string): { success: true; data: any } | { success: false; error: string } {
  try {
    if (!jsonString.trim() || !path.trim()) {
      return { success: true, data: null };
    }

    let parsedJson;
    try {
      parsedJson = JSON.parse(jsonString);
    } catch (e) {
      return { success: false, error: 'Invalid JSON input' };
    }

    const result = JSONPath({ path, json: parsedJson });
    return { success: true, data: result };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Invalid JSONPath expression' };
  }
}
