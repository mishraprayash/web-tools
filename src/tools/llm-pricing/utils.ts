export interface LLMModel {
  id: string;
  provider: string;
  name: string;
  inputCostPer1M: number;
  cachedInputCostPer1M: number;
  outputCostPer1M: number;
  contextWindow: number;
}

export const llmModels: LLMModel[] = [
  // OpenAI (Latest 2026 Lineup)
  { id: 'gpt-5-5', provider: 'OpenAI', name: 'GPT-5.5 (Flagship)', inputCostPer1M: 5.00, cachedInputCostPer1M: 0.50, outputCostPer1M: 30.00, contextWindow: 1000000 },
  { id: 'gpt-5-4', provider: 'OpenAI', name: 'GPT-5.4', inputCostPer1M: 2.50, cachedInputCostPer1M: 0.25, outputCostPer1M: 15.00, contextWindow: 128000 },
  { id: 'o3-mini', provider: 'OpenAI', name: 'o3-mini', inputCostPer1M: 1.10, cachedInputCostPer1M: 0.55, outputCostPer1M: 4.40, contextWindow: 200000 },

  // Anthropic (Latest 2026 Lineup)
  { id: 'claude-fable-5', provider: 'Anthropic', name: 'Claude Fable 5', inputCostPer1M: 10.00, cachedInputCostPer1M: 1.00, outputCostPer1M: 50.00, contextWindow: 1000000 },
  { id: 'claude-opus-4-8', provider: 'Anthropic', name: 'Claude Opus 4.8', inputCostPer1M: 5.00, cachedInputCostPer1M: 0.50, outputCostPer1M: 25.00, contextWindow: 1000000 },
  { id: 'claude-sonnet-4-6', provider: 'Anthropic', name: 'Claude Sonnet 4.6', inputCostPer1M: 3.00, cachedInputCostPer1M: 0.30, outputCostPer1M: 15.00, contextWindow: 1000000 },
  { id: 'claude-haiku-4-5', provider: 'Anthropic', name: 'Claude Haiku 4.5', inputCostPer1M: 1.00, cachedInputCostPer1M: 0.10, outputCostPer1M: 5.00, contextWindow: 1000000 },

  // Google (Latest 2026 Lineup)
  { id: 'gemini-3-1-pro', provider: 'Google', name: 'Gemini 3.1 Pro', inputCostPer1M: 1.25, cachedInputCostPer1M: 0.125, outputCostPer1M: 5.00, contextWindow: 2000000 },
  { id: 'gemini-3-1-flash', provider: 'Google', name: 'Gemini 3.1 Flash', inputCostPer1M: 0.075, cachedInputCostPer1M: 0.0075, outputCostPer1M: 0.30, contextWindow: 1000000 },

  // DeepSeek (Latest 2026 Lineup)
  { id: 'deepseek-v4-pro', provider: 'DeepSeek', name: 'DeepSeek-V4-Pro', inputCostPer1M: 0.435, cachedInputCostPer1M: 0.003625, outputCostPer1M: 0.87, contextWindow: 128000 },
  { id: 'deepseek-v4-flash', provider: 'DeepSeek', name: 'DeepSeek-V4-Flash', inputCostPer1M: 0.14, cachedInputCostPer1M: 0.0028, outputCostPer1M: 0.28, contextWindow: 128000 },
];

export interface CostCalculation {
  model: LLMModel;
  cachedInputCost: number;
  uncachedInputCost: number;
  outputCost: number;
  totalCost: number;
}

export function calculateCosts(inputTokens: number, outputTokens: number, cacheHitPercentage: number): CostCalculation[] {
  const cacheRatio = Math.max(0, Math.min(100, cacheHitPercentage)) / 100;
  const cachedTokens = inputTokens * cacheRatio;
  const uncachedTokens = inputTokens * (1 - cacheRatio);

  return llmModels.map(model => {
    const cachedInputCost = (cachedTokens / 1_000_000) * model.cachedInputCostPer1M;
    const uncachedInputCost = (uncachedTokens / 1_000_000) * model.inputCostPer1M;
    const outputCost = (outputTokens / 1_000_000) * model.outputCostPer1M;
    return {
      model,
      cachedInputCost,
      uncachedInputCost,
      outputCost,
      totalCost: cachedInputCost + uncachedInputCost + outputCost
    };
  }).sort((a, b) => a.totalCost - b.totalCost);
}
