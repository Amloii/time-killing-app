import { Warrior, WarriorRarity } from '../types';

export const WARRIORS: Warrior[] = [
  // Common Warriors (100-200 points)
  {
    id: 'samurai-novice',
    name: 'Novice Samurai',
    rarity: 'Common',
    cost: 100,
    description: 'A young warrior beginning their journey',
    imageUrl: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
    animationUrl: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
    unlocked: false
  },
  {
    id: 'forest-guardian',
    name: 'Forest Guardian',
    rarity: 'Common',
    cost: 150,
    description: 'Protector of the ancient woods',
    imageUrl: 'https://images.pexels.com/photos/8728380/pexels-photo-8728380.jpeg?auto=compress&cs=tinysrgb&w=400',
    animationUrl: 'https://images.pexels.com/photos/8728380/pexels-photo-8728380.jpeg?auto=compress&cs=tinysrgb&w=400',
    unlocked: false
  },
  {
    id: 'mountain-monk',
    name: 'Mountain Monk',
    rarity: 'Common',
    cost: 200,
    description: 'Wise warrior from the high peaks',
    imageUrl: 'https://images.pexels.com/photos/8349833/pexels-photo-8349833.jpeg?auto=compress&cs=tinysrgb&w=400',
    animationUrl: 'https://images.pexels.com/photos/8349833/pexels-photo-8349833.jpeg?auto=compress&cs=tinysrgb&w=400',
    unlocked: false
  },
  
  // Rare Warriors (250-400 points)
  {
    id: 'storm-blade',
    name: 'Storm Blade',
    rarity: 'Rare',
    cost: 250,
    description: 'Master of lightning-fast strikes',
    imageUrl: 'https://images.pexels.com/photos/7991448/pexels-photo-7991448.jpeg?auto=compress&cs=tinysrgb&w=400',
    animationUrl: 'https://images.pexels.com/photos/7991448/pexels-photo-7991448.jpeg?auto=compress&cs=tinysrgb&w=400',
    unlocked: false
  },
  {
    id: 'shadow-ninja',
    name: 'Shadow Ninja',
    rarity: 'Rare',
    cost: 350,
    description: 'Silent warrior of the night',
    imageUrl: 'https://images.pexels.com/photos/8728142/pexels-photo-8728142.jpeg?auto=compress&cs=tinysrgb&w=400',
    animationUrl: 'https://images.pexels.com/photos/8728142/pexels-photo-8728142.jpeg?auto=compress&cs=tinysrgb&w=400',
    unlocked: false
  },
  {
    id: 'fire-ronin',
    name: 'Fire Ronin',
    rarity: 'Rare',
    cost: 400,
    description: 'Wandering warrior with burning spirit',
    imageUrl: 'https://images.pexels.com/photos/8728381/pexels-photo-8728381.jpeg?auto=compress&cs=tinysrgb&w=400',
    animationUrl: 'https://images.pexels.com/photos/8728381/pexels-photo-8728381.jpeg?auto=compress&cs=tinysrgb&w=400',
    unlocked: false
  },
  
  // Epic Warriors (500-700 points)
  {
    id: 'dragon-slayer',
    name: 'Dragon Slayer',
    rarity: 'Epic',
    cost: 500,
    description: 'Legendary hunter of ancient beasts',
    imageUrl: 'https://images.pexels.com/photos/8728143/pexels-photo-8728143.jpeg?auto=compress&cs=tinysrgb&w=400',
    animationUrl: 'https://images.pexels.com/photos/8728143/pexels-photo-8728143.jpeg?auto=compress&cs=tinysrgb&w=400',
    unlocked: false
  },
  {
    id: 'celestial-warrior',
    name: 'Celestial Warrior',
    rarity: 'Epic',
    cost: 650,
    description: 'Champion blessed by the heavens',
    imageUrl: 'https://images.pexels.com/photos/8728144/pexels-photo-8728144.jpeg?auto=compress&cs=tinysrgb&w=400',
    animationUrl: 'https://images.pexels.com/photos/8728144/pexels-photo-8728144.jpeg?auto=compress&cs=tinysrgb&w=400',
    unlocked: false
  },
  {
    id: 'void-master',
    name: 'Void Master',
    rarity: 'Epic',
    cost: 700,
    description: 'Controller of dark energies',
    imageUrl: 'https://images.pexels.com/photos/8728145/pexels-photo-8728145.jpeg?auto=compress&cs=tinysrgb&w=400',
    animationUrl: 'https://images.pexels.com/photos/8728145/pexels-photo-8728145.jpeg?auto=compress&cs=tinysrgb&w=400',
    unlocked: false
  },
  
  // Legendary Warriors (800-1000 points)
  {
    id: 'shogun-supreme',
    name: 'Shogun Supreme',
    rarity: 'Legendary',
    cost: 800,
    description: 'Ultimate ruler of all warriors',
    imageUrl: 'https://images.pexels.com/photos/8728146/pexels-photo-8728146.jpeg?auto=compress&cs=tinysrgb&w=400',
    animationUrl: 'https://images.pexels.com/photos/8728146/pexels-photo-8728146.jpeg?auto=compress&cs=tinysrgb&w=400',
    unlocked: false
  },
  {
    id: 'phoenix-emperor',
    name: 'Phoenix Emperor',
    rarity: 'Legendary',
    cost: 1000,
    description: 'Immortal warrior reborn from flames',
    imageUrl: 'https://images.pexels.com/photos/8728147/pexels-photo-8728147.jpeg?auto=compress&cs=tinysrgb&w=400',
    animationUrl: 'https://images.pexels.com/photos/8728147/pexels-photo-8728147.jpeg?auto=compress&cs=tinysrgb&w=400',
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