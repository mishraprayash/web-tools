import { format } from 'sql-formatter';

export type SqlKeywordCase = 'upper' | 'lower' | 'preserve';

export interface SqlFormatterOptions {
  language: 'sql' | 'postgresql' | 'mysql' | 'plsql';
  keywordCase: SqlKeywordCase;
  tabWidth: number;
  useSpaces: boolean;
}

export function formatSql(query: string, options: SqlFormatterOptions): { success: true; data: string } | { success: false; error: string } {
  try {
    if (!query.trim()) {
      return { success: true, data: '' };
    }

    const formatted = format(query, {
      language: options.language,
      keywordCase: options.keywordCase,
      tabWidth: options.tabWidth,
      useTabs: !options.useSpaces,
    });

    return { success: true, data: formatted };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to format SQL' };
  }
}
