export interface PromptState {
  role: string;
  context: string;
  task: string;
  constraints: string[];
  format: string;
  tone: string;
}

export function generateSystemPrompt(state: PromptState): string {
  const parts: string[] = [];

  if (state.role.trim()) {
    parts.push(`## Role\nYou are an expert ${state.role.trim()}.`);
  }

  if (state.context.trim()) {
    parts.push(`## Context\n${state.context.trim()}`);
  }

  if (state.task.trim()) {
    parts.push(`## Task\n${state.task.trim()}`);
  }

  if (state.constraints.length > 0) {
    const validConstraints = state.constraints.filter(c => c.trim() !== '');
    if (validConstraints.length > 0) {
      parts.push(`## Guidelines & Constraints\n${validConstraints.map(c => `- ${c.trim()}`).join('\n')}`);
    }
  }

  if (state.tone.trim()) {
    parts.push(`## Tone\nMaintain a ${state.tone.trim()} tone throughout your response.`);
  }

  if (state.format.trim()) {
    parts.push(`## Output Format\n${state.format.trim()}`);
  }

  return parts.join('\n\n');
}
