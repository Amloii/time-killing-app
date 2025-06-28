import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { toast } from 'sonner';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  modelInfo?: {
    name: string;
    version: string;
  };
}

export async function validateGeminiKey(apiKey: string): Promise<ValidationResult> {
  if (!apiKey || apiKey.trim().length === 0) {
    return { isValid: false, error: 'API key is required' };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
    
    // Test with a simple prompt
    const result = await model.generateContent('Hello, respond with just "OK"');
    const response = await result.response;
    const text = response.text();
    
    if (text) {
      return {
        isValid: true,
        modelInfo: {
          name: 'Gemini',
          version: '2.0 Flash Lite',
        },
      };
    } else {
      return { isValid: false, error: 'Invalid response from Gemini API' };
    }
  } catch (error: any) {
    let errorMessage = 'Failed to validate Gemini API key';
    
    if (error.message?.includes('API_KEY_INVALID')) {
      errorMessage = 'Invalid API key';
    } else if (error.message?.includes('PERMISSION_DENIED')) {
      errorMessage = 'API key does not have required permissions';
    } else if (error.message?.includes('QUOTA_EXCEEDED')) {
      errorMessage = 'API quota exceeded';
    }
    
    return { isValid: false, error: errorMessage };
  }
}

export async function validateOpenAIKey(apiKey: string): Promise<ValidationResult> {
  if (!apiKey || apiKey.trim().length === 0) {
    return { isValid: false, error: 'API key is required' };
  }

  try {
    const openai = new OpenAI({ 
      apiKey,
      dangerouslyAllowBrowser: true 
    });
    
    // Test with a simple completion
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Hello, respond with just "OK"' }],
      max_tokens: 10,
    });
    
    if (completion.choices[0]?.message?.content) {
      return {
        isValid: true,
        modelInfo: {
          name: 'OpenAI',
          version: 'GPT-4o Mini',
        },
      };
    } else {
      return { isValid: false, error: 'Invalid response from OpenAI API' };
    }
  } catch (error: any) {
    let errorMessage = 'Failed to validate OpenAI API key';
    
    if (error.status === 401) {
      errorMessage = 'Invalid API key';
    } else if (error.status === 403) {
      errorMessage = 'API key does not have required permissions';
    } else if (error.status === 429) {
      errorMessage = 'API rate limit exceeded';
    } else if (error.status === 402) {
      errorMessage = 'Insufficient credits or billing issue';
    }
    
    return { isValid: false, error: errorMessage };
  }
}

export async function validateApiKey(
  provider: 'gemini' | 'openai',
  apiKey: string
): Promise<ValidationResult> {
  switch (provider) {
    case 'gemini':
      return validateGeminiKey(apiKey);
    case 'openai':
      return validateOpenAIKey(apiKey);
    default:
      return { isValid: false, error: 'Unknown provider' };
  }
}