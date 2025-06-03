import { GoogleGenerativeAI } from '@google/generative-ai';
import { SubTask, TaskType } from '../types';

const SYSTEM_PROMPT = `You are a task analysis assistant. Break down tasks into smaller, actionable subtasks.
For each subtask, provide:
- A clear, concise description
- Estimated time (in minutes: 15, 30, 60, 120, 240, or 480)
- Difficulty level (1-5)
- Task type (Research, Development, Design, Testing, or Documentation)

Format your response as a JSON array of subtasks.`;

export async function analyzeTask(task: string, apiKey: string): Promise<Omit<SubTask, 'id'>[]> {
  if (!apiKey) {
    throw new Error('Gemini API key is required');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `${SYSTEM_PROMPT}\n\nTask to analyze: ${task}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }
    
    const subtasks = JSON.parse(jsonMatch[0]);
    
    // Validate and format subtasks
    return subtasks.map((subtask: any) => ({
      description: subtask.description,
      estimatedTime: validateTime(subtask.estimatedTime),
      difficulty: validateDifficulty(subtask.difficulty),
      type: validateTaskType(subtask.type),
    }));
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to analyze task. Please try again.');
  }
}

function validateTime(time: number): number {
  const validTimes = [15, 30, 60, 120, 240, 480];
  const closest = validTimes.reduce((prev, curr) => 
    Math.abs(curr - time) < Math.abs(prev - time) ? curr : prev
  );
  return closest;
}

function validateDifficulty(difficulty: number): 1 | 2 | 3 | 4 | 5 {
  return Math.max(1, Math.min(5, Math.round(difficulty))) as 1 | 2 | 3 | 4 | 5;
}

function validateTaskType(type: string): TaskType {
  const validTypes: TaskType[] = ['Research', 'Development', 'Design', 'Testing', 'Documentation'];
  const normalized = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  return validTypes.find(t => t === normalized) || 'Development';
}