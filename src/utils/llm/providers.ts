import { LLMProvider } from '../../types';

export const LLM_PROVIDERS: LLMProvider[] = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    maxTokens: 32768,
    defaultModel: 'gemini-2.0-flash-lite',
    models: [
      {
        id: 'gemini-2.0-flash-lite',
        name: 'Gemini 2.0 Flash Lite',
        maxTokens: 32768,
        costPer1kTokens: 0.075,
      },
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        maxTokens: 2097152,
        costPer1kTokens: 1.25,
      },
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        maxTokens: 1048576,
        costPer1kTokens: 0.075,
      },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    maxTokens: 128000,
    defaultModel: 'gpt-4o-mini',
    models: [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        maxTokens: 128000,
        costPer1kTokens: 2.5,
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        maxTokens: 128000,
        costPer1kTokens: 0.15,
      },
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        maxTokens: 128000,
        costPer1kTokens: 10.0,
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        maxTokens: 16385,
        costPer1kTokens: 0.5,
      },
    ],
  },
];

export const getProviderById = (id: 'gemini' | 'openai'): LLMProvider | undefined => {
  return LLM_PROVIDERS.find(provider => provider.id === id);
};

export const getModelById = (providerId: 'gemini' | 'openai', modelId: string) => {
  const provider = getProviderById(providerId);
  return provider?.models.find(model => model.id === modelId);
};

export const getDefaultSettings = (providerId: 'gemini' | 'openai') => {
  const provider = getProviderById(providerId);
  if (!provider) return null;

  return {
    temperature: 0.7,
    maxTokens: Math.min(4096, provider.maxTokens),
    model: provider.defaultModel,
    outputFormat: 'json' as const,
    enableUsageMonitoring: true,
  };
};