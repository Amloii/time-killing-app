import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { LLMSettings, LLMUsage } from '../../types';
import { getModelById } from './providers';

export interface ProcessingOptions {
  provider: 'gemini' | 'openai';
  apiKey: string;
  settings: LLMSettings;
  systemPrompt?: string;
  userPrompt: string;
  expectedFormat?: 'json' | 'text';
}

export interface ProcessingResult {
  content: string;
  usage: LLMUsage;
  success: boolean;
  error?: string;
}

// Token estimation (rough approximation)
function estimateTokens(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4);
}

// Chunk text based on provider limits
function chunkText(text: string, maxTokens: number): string[] {
  const estimatedTokens = estimateTokens(text);
  
  if (estimatedTokens <= maxTokens) {
    return [text];
  }
  
  const chunks: string[] = [];
  const chunkSize = Math.floor(maxTokens * 3.5); // Conservative estimate
  
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  
  return chunks;
}

async function processWithGemini(
  apiKey: string,
  settings: LLMSettings,
  systemPrompt: string,
  userPrompt: string
): Promise<ProcessingResult> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: settings.model,
      generationConfig: {
        temperature: settings.temperature,
        maxOutputTokens: settings.maxTokens,
      },
    });

    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${userPrompt}` : userPrompt;
    const modelInfo = getModelById('gemini', settings.model);
    
    // Check if we need to chunk the input
    const chunks = chunkText(fullPrompt, modelInfo?.maxTokens || 32768);
    let totalTokens = 0;
    let results: string[] = [];
    
    for (const chunk of chunks) {
      const result = await model.generateContent(chunk);
      const response = await result.response;
      const text = response.text();
      
      results.push(text);
      totalTokens += estimateTokens(chunk + text);
    }
    
    const finalContent = chunks.length > 1 ? results.join('\n\n') : results[0];
    
    return {
      content: finalContent,
      usage: {
        provider: 'gemini',
        model: settings.model,
        tokensUsed: totalTokens,
        cost: (totalTokens / 1000) * (modelInfo?.costPer1kTokens || 0.075),
        timestamp: new Date().toISOString(),
      },
      success: true,
    };
  } catch (error: any) {
    return {
      content: '',
      usage: {
        provider: 'gemini',
        model: settings.model,
        tokensUsed: 0,
        cost: 0,
        timestamp: new Date().toISOString(),
      },
      success: false,
      error: error.message || 'Failed to process with Gemini',
    };
  }
}

async function processWithOpenAI(
  apiKey: string,
  settings: LLMSettings,
  systemPrompt: string,
  userPrompt: string
): Promise<ProcessingResult> {
  try {
    const openai = new OpenAI({ 
      apiKey,
      dangerouslyAllowBrowser: true 
    });

    const messages: any[] = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: userPrompt });

    const modelInfo = getModelById('openai', settings.model);
    
    // Check if we need to chunk the input
    const totalInputTokens = estimateTokens(systemPrompt + userPrompt);
    const maxInputTokens = (modelInfo?.maxTokens || 128000) - settings.maxTokens - 1000; // Reserve space for output
    
    if (totalInputTokens > maxInputTokens) {
      // For OpenAI, we'll truncate rather than chunk for simplicity
      const truncatedPrompt = userPrompt.slice(0, Math.floor(maxInputTokens * 3.5));
      messages[messages.length - 1].content = truncatedPrompt;
    }

    const completion = await openai.chat.completions.create({
      model: settings.model,
      messages,
      temperature: settings.temperature,
      max_tokens: settings.maxTokens,
    });

    const content = completion.choices[0]?.message?.content || '';
    const tokensUsed = completion.usage?.total_tokens || estimateTokens(content);
    
    return {
      content,
      usage: {
        provider: 'openai',
        model: settings.model,
        tokensUsed,
        cost: (tokensUsed / 1000) * (modelInfo?.costPer1kTokens || 0.15),
        timestamp: new Date().toISOString(),
      },
      success: true,
    };
  } catch (error: any) {
    return {
      content: '',
      usage: {
        provider: 'openai',
        model: settings.model,
        tokensUsed: 0,
        cost: 0,
        timestamp: new Date().toISOString(),
      },
      success: false,
      error: error.message || 'Failed to process with OpenAI',
    };
  }
}

export async function processText(options: ProcessingOptions): Promise<ProcessingResult> {
  const { provider, apiKey, settings, systemPrompt = '', userPrompt } = options;
  
  switch (provider) {
    case 'gemini':
      return processWithGemini(apiKey, settings, systemPrompt, userPrompt);
    case 'openai':
      return processWithOpenAI(apiKey, settings, systemPrompt, userPrompt);
    default:
      return {
        content: '',
        usage: {
          provider,
          model: settings.model,
          tokensUsed: 0,
          cost: 0,
          timestamp: new Date().toISOString(),
        },
        success: false,
        error: 'Unknown provider',
      };
  }
}