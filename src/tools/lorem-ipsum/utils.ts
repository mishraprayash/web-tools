const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const WORDS = LOREM.replace(/[,.]/g, '').split(/\s+/);

export function generateWords(count: number): string {
  const result: string[] = [];
  const safe = Math.max(1, Math.min(count, 10000));
  for (let i = 0; i < safe; i++) {
    result.push(WORDS[i % WORDS.length]);
  }
  return result.join(' ');
}

export function generateSentences(count: number): string {
  const result: string[] = [];
  const safe = Math.max(1, Math.min(count, 1000));
  for (let i = 0; i < safe; i++) {
    const sentence = generateWords(Math.floor(Math.random() * 15) + 5);
    result.push(sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.');
  }
  return result.join(' ');
}

export function generateParagraphs(count: number): string {
  const result: string[] = [];
  const safe = Math.max(1, Math.min(count, 500));
  for (let i = 0; i < safe; i++) {
    const para = generateSentences(Math.floor(Math.random() * 4) + 3);
    result.push(para);
  }
  return result.join('\n\n');
}
