import { Task, LLMSettings } from '../../types';
import { processText } from './textProcessor';

const TASK_SUGGESTION_PROMPTS = {
  gemini: `You are a task estimation assistant. Based on the task description and previous tasks, suggest appropriate time estimates and difficulty levels.

Consider:
- Task complexity and scope
- Similar previous tasks
- Required skills and experience

Format your response as JSON with:
- estimatedTime (in minutes: from 5 to 480)
- difficulty (1-5)
- explanation (brief justification)`,

  openai: `You are a task estimation assistant. Analyze the given task and provide estimates.

Based on the task description and previous similar tasks, suggest:
1. Estimated time in minutes (5-480)
2. Difficulty level (1-5 scale)
3. Brief explanation of your reasoning

Respond in JSON format with: estimatedTime, difficulty, explanation`
};

const TASK_ANALYSIS_PROMPTS = {
  gemini: `You are a task analysis assistant. Break down tasks into smaller, actionable subtasks.
For each subtask, provide:
- A clear, concise description
- A short summary (max 50 characters)
- Estimated time (in minutes: from 5 to 480)
- Difficulty level (1-5)
- Task type (Research, Development, Design, Testing, or Documentation)

Format your response as a JSON array of subtasks.`,

  openai: `Break down the given task into smaller, actionable subtasks.

For each subtask, provide:
- description: Clear, actionable description
- summary: Short title (max 50 chars)
- estimatedTime: Time in minutes (5-480)
- difficulty: Scale 1-5
- type: One of: Research, Development, Design, Testing, Documentation

Return as JSON array of subtask objects.`
};

export async function suggestTaskAttributes(
  taskTitle: string,
  taskDescription: string | undefined,
  previousTasks: Array<{ title: string; estimatedTime?: number; difficulty: number }>,
  provider: 'gemini' | 'openai',
  apiKey: string,
  settings: LLMSettings
): Promise<{ estimatedTime: number; difficulty: number; explanation: string }> {
  const context = previousTasks
    .map(task => `- "${task.title}" (${task.estimatedTime || 'unknown'} min, difficulty: ${task.difficulty})`)
    .join('\n');

  const userPrompt = `Current task:
Title: ${taskTitle}
${taskDescription ? `Description: ${taskDescription}` : ''}

Previous tasks for context:
${context}`;

  const result = await processText({
    provider,
    apiKey,
    settings,
    systemPrompt: TASK_SUGGESTION_PROMPTS[provider],
    userPrompt,
    expectedFormat: 'json',
  });

  if (!result.success) {
    throw new Error(result.error || 'Failed to generate suggestions');
  }

  try {
    const jsonMatch = result.content.match(/\{[\s\S]*\}/);
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
    throw new Error('Failed to parse AI response');
  }
}

export async function analyzeTask(
  task: string,
  provider: 'gemini' | 'openai',
  apiKey: string,
  settings: LLMSettings
): Promise<any[]> {
  const result = await processText({
    provider,
    apiKey,
    settings,
    systemPrompt: TASK_ANALYSIS_PROMPTS[provider],
    userPrompt: `Task to analyze: ${task}`,
    expectedFormat: 'json',
  });

  if (!result.success) {
    throw new Error(result.error || 'Failed to analyze task');
  }

  try {
    const jsonMatch = result.content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }
    
    const subtasks = JSON.parse(jsonMatch[0]);
    
    return subtasks.map((subtask: any) => ({
      description: subtask.description,
      summary: subtask.summary || subtask.description.slice(0, 50),
      estimatedTime: validateTime(subtask.estimatedTime),
      difficulty: validateDifficulty(subtask.difficulty),
      type: validateTaskType(subtask.type),
    }));
  } catch (error) {
    throw new Error('Failed to parse AI response');
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

function validateTaskType(type: string): 'Research' | 'Development' | 'Design' | 'Testing' | 'Documentation' {
  const validTypes = ['Research', 'Development', 'Design', 'Testing', 'Documentation'];
  if (typeof type !== 'string' || !type.trim()) {
    return 'Development';
  }
  
  const normalized = type.trim().charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  return validTypes.includes(normalized) ? normalized as any : 'Development';
}