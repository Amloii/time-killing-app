import { Task } from '../types';

export interface PointsBreakdown {
  basePoints: number;
  bonusPoints: number;
  streakBonus: number;
  total: number;
  breakdown: string[];
}

export const calculateTaskPoints = (
  task: Task,
  completedEarly: boolean = false,
  currentStreak: number = 0
): PointsBreakdown => {
  const estimatedTime = task.estimatedTime || 30;
  const difficulty = task.difficulty;
  
  // Base points calculation
  let basePoints = 0;
  
  if (estimatedTime <= 15) {
    // Easy tasks: 10-25 points
    basePoints = 10 + (difficulty - 1) * 3;
  } else if (estimatedTime <= 45) {
    // Medium tasks: 25-75 points
    basePoints = 25 + (difficulty - 1) * 12;
  } else {
    // Complex tasks: 75-150 points
    basePoints = 75 + (difficulty - 1) * 18;
  }
  
  // Bonus calculations
  let bonusPoints = 0;
  let streakBonus = 0;
  const breakdown: string[] = [];
  
  breakdown.push(`Base points: ${basePoints}`);
  
  // Early completion bonus (20%)
  if (completedEarly) {
    bonusPoints = Math.round(basePoints * 0.2);
    breakdown.push(`Early completion bonus: +${bonusPoints}`);
  }
  
  // Streak bonus (5 points per consecutive day)
  if (currentStreak > 0) {
    streakBonus = currentStreak * 5;
    breakdown.push(`Streak bonus (${currentStreak} days): +${streakBonus}`);
  }
  
  const total = basePoints + bonusPoints + streakBonus;
  
  return {
    basePoints,
    bonusPoints,
    streakBonus,
    total,
    breakdown
  };
};

export const getPointsForTimeRange = (estimatedTime: number): { min: number; max: number } => {
  if (estimatedTime <= 15) {
    return { min: 10, max: 25 };
  } else if (estimatedTime <= 45) {
    return { min: 25, max: 75 };
  } else {
    return { min: 75, max: 150 };
  }
};

export const calculateLevel = (points: number): number => {
  // Level progression: 100 points for level 1, then +50 points per level
  if (points < 100) return 0;
  return Math.floor((points - 100) / 50) + 1;
};

export const getPointsForNextLevel = (currentPoints: number): number => {
  const currentLevel = calculateLevel(currentPoints);
  const nextLevelPoints = currentLevel === 0 ? 100 : 100 + (currentLevel * 50);
  return nextLevelPoints - currentPoints;
};