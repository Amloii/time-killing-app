import { Warrior, WarriorRarity } from '../types';

export const WARRIORS: Warrior[] = [
  // Common Warriors (100-200 points)
  {
    id: 'samurai-novice',
    name: 'Novice Samurai',
    rarity: 'Common',
    cost: 100,
    description: 'A young warrior beginning their journey',
    imageUrl: '/novice_samurai.png',
    animationUrl: '/novice_samurai.png',
    unlocked: false
  },
  {
    id: 'forest-guardian',
    name: 'Forest Guardian',
    rarity: 'Common',
    cost: 150,
    description: 'Protector of the ancient woods',
    imageUrl: '/forest_guardian.png',
    animationUrl: '/forest_guardian.png',
    unlocked: false
  },
  {
    id: 'mountain-monk',
    name: 'Mountain Monk',
    rarity: 'Common',
    cost: 200,
    description: 'Wise warrior from the high peaks',
    imageUrl: '/mountain_monk.png',
    animationUrl: '/mountain_monk.png',
    unlocked: false
  },
  
  // Rare Warriors (250-400 points)
  {
    id: 'storm-blade',
    name: 'Storm Blade',
    rarity: 'Rare',
    cost: 250,
    description: 'Master of lightning-fast strikes',
    imageUrl: '/storm_blade.pngf',
    animationUrl: '/storm_blade.png',
    unlocked: false
  },
  {
    id: 'shadow-ninja',
    name: 'Shadow Ninja',
    rarity: 'Rare',
    cost: 350,
    description: 'Silent warrior of the night',
    imageUrl: '/shadow_ninja.png',
    animationUrl: '/shadow_ninja.png',
    unlocked: false
  },
  {
    id: 'fire-ronin',
    name: 'Fire Ronin',
    rarity: 'Rare',
    cost: 400,
    description: 'Wandering warrior with burning spirit',
    imageUrl: '/fire_ronin.png',
    animationUrl: '/fire_ronin.png',
    unlocked: false
  },
  
  // Epic Warriors (500-700 points)
  {
    id: 'dragon-slayer',
    name: 'Dragon Slayer',
    rarity: 'Epic',
    cost: 500,
    description: 'Legendary hunter of ancient beasts',
    imageUrl: '/dragon_slayer.png',
    animationUrl: '/dragon_slayer.png',
    unlocked: false
  },
  {
    id: 'celestial-warrior',
    name: 'Celestial Warrior',
    rarity: 'Epic',
    cost: 650,
    description: 'Champion blessed by the heavens',
    imageUrl: '/celestial_warrior.png',
    animationUrl: '/celestial_warrior.png',
    unlocked: false
  },
  {
    id: 'void-master',
    name: 'Void Master',
    rarity: 'Epic',
    cost: 700,
    description: 'Controller of dark energies',
    imageUrl: '/void_master.png',
    animationUrl: '/void_master.png',
    unlocked: false
  },
  
  // Legendary Warriors (800-1000 points)
  {
    id: 'shogun-supreme',
    name: 'Shogun Supreme',
    rarity: 'Legendary',
    cost: 800,
    description: 'Ultimate ruler of all warriors',
    imageUrl: '/void_master.png',
    animationUrl: '/0609.gif',
    unlocked: false
  },
  {
    id: 'phoenix-emperor',
    name: 'Phoenix Emperor',
    rarity: 'Legendary',
    cost: 1000,
    description: 'Immortal warrior reborn from flames',
    imageUrl: '/0609.gif',
    animationUrl: '/0609.gif',
    unlocked: false
  }
];

export const getRarityColor = (rarity: WarriorRarity): string => {
  switch (rarity) {
    case 'Common':
      return 'text-gray-600 bg-gray-100 border-gray-300';
    case 'Rare':
      return 'text-blue-600 bg-blue-100 border-blue-300';
    case 'Epic':
      return 'text-purple-600 bg-purple-100 border-purple-300';
    case 'Legendary':
      return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    default:
      return 'text-gray-600 bg-gray-100 border-gray-300';
  }
};

export const getRarityGradient = (rarity: WarriorRarity): string => {
  switch (rarity) {
    case 'Common':
      return 'from-gray-400 to-gray-600';
    case 'Rare':
      return 'from-blue-400 to-blue-600';
    case 'Epic':
      return 'from-purple-400 to-purple-600';
    case 'Legendary':
      return 'from-yellow-400 to-yellow-600';
    default:
      return 'from-gray-400 to-gray-600';
  }
};