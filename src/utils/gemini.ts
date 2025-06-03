import { GoogleGenerativeAI } from '@google/generative-ai';
import { SubTask, TaskType } from '../types';

const SYSTEM_PROMPT = `You are a task analysis assistant. Break down tasks into smaller, actionable subtasks.
For each subtask, provide:
- A clear, concise description
 - A short summary (max 50 characters)
- Estimated time (in minutes: from 5 to 480)
- Difficulty level (1-5)
- Task type (Research, Development, Design, Testing, or Documentation)

Format your response as a JSON array of subtasks.`;

const TASK_SUGGESTION_PROMPT = `You are a task estimation assistant. Based on the task description and previous tasks, suggest appropriate time estimates and difficulty levels.

Consider:
- Task complexity and scope
- Similar previous tasks
- Required skills and experience

Format your response as JSON with:
- estimatedTime (in minutes: from 5 to 480)
- difficulty (1-5)
- explanation (brief justification)`;

export async function suggestTaskAttributes(
  taskTitle: string,
  taskDescription: string | undefined,
  previousTasks: Array<{ title: string; estimatedTime?: number; difficulty: number }>,
  apiKey: string
): Promise<{ estimatedTime: number; difficulty: number; explanation: string }> {
  if (!apiKey) {
    throw new Error('Gemini API key is required');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

  const context = previousTasks
    .map(task => `- "${task.title}" (${task.estimatedTime || 'unknown'} min, difficulty: ${task.difficulty})`)
    .join('\n');

  const prompt = `${TASK_SUGGESTION_PROMPT}

Current task:
Title: ${taskTitle}
${taskDescription ? `Description: ${taskDescription}` : ''}

Previous tasks for context:
${context}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }
    
    const suggestion = JSON.parse(jsonMatch[0]);
    
    return {
      estimatedTime: validateTime(suggestion.estimatedTime),
      difficulty: validateDifficulty(suggestion.difficulty),
      explanation: suggestion.explanation || 'Based on task complexity and similar previous tasks',
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate suggestions. Please try again.');
  }
}
export async function analyzeTask(task: string, apiKey: string): Promise<Omit<SubTask, 'id'>[]> {
  if (!apiKey) {
    throw new Error('Gemini API key is required');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

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
      summary: subtask.summary || subtask.description.slice(0, 50),
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
  if (typeof type !== 'string' || !type.trim()) {
    return 'Development';
  }
  
  const normalized = type.trim().charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  return validTypes.includes(normalized as TaskType) ? (normalized as TaskType) : 'Development';
}