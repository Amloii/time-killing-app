import { Pet, WarriorRarity } from '../types';

export const PETS: Pet[] = [
  // Common Pets (50-100 points)
  {
    id: 'forest-sprite',
    name: 'Forest Sprite',
    type: 'Eagle',
    rarity: 'Common',
    cost: 50,
    description: 'A small woodland companion that brings luck',
    imageUrl: '/pets/forest_sprite.png',
    animationUrl: '/pets/forest_sprite.gif',
    abilities: ['Luck Boost', 'Nature Healing'],
    compatibleWarriors: ['samurai-novice', 'forest-guardian', 'mountain-monk']
  },
  {
    id: 'ember-fox',
    name: 'Ember Fox',
    type: 'Wolf',
    rarity: 'Common',
    cost: 75,
    description: 'A fiery fox with a warm spirit',
    imageUrl: '/pets/ember_fox.png',
    animationUrl: '/pets/ember_fox.gif',
    abilities: ['Fire Resistance', 'Speed Boost'],
    compatibleWarriors: ['fire-ronin', 'storm-blade', 'shadow-ninja']
  },
  {
    id: 'crystal-turtle',
    name: 'Crystal Turtle',
    type: 'Turtle',
    rarity: 'Common',
    cost: 100,
    description: 'A wise turtle with crystalline shell',
    imageUrl: '/pets/crystal_turtle.png',
    animationUrl: '/pets/crystal_turtle.gif',
    abilities: ['Defense Boost', 'Meditation'],
    compatibleWarriors: ['mountain-monk', 'celestial-warrior', 'void-master']
  },

  // Rare Pets (125-200 points)
  {
    id: 'storm-hawk',
    name: 'Storm Hawk',
    type: 'Eagle',
    rarity: 'Rare',
    cost: 125,
    description: 'A majestic hawk that commands the winds',
    imageUrl: '/pets/storm_hawk.png',
    animationUrl: '/pets/storm_hawk.gif',
    abilities: ['Wind Control', 'Lightning Strike', 'Aerial Reconnaissance'],
    compatibleWarriors: ['storm-blade', 'celestial-warrior', 'dragon-slayer']
  },
  {
    id: 'shadow-panther',
    name: 'Shadow Panther',
    type: 'Tiger',
    rarity: 'Rare',
    cost: 175,
    description: 'A stealthy panther that moves like shadow',
    imageUrl: '/pets/shadow_panther.png',
    animationUrl: '/pets/shadow_panther.gif',
    abilities: ['Stealth', 'Shadow Strike', 'Night Vision'],
    compatibleWarriors: ['shadow-ninja', 'void-master', 'fire-ronin']
  },
  {
    id: 'flame-wolf',
    name: 'Flame Wolf',
    type: 'Wolf',
    rarity: 'Rare',
    cost: 200,
    description: 'A fierce wolf wreathed in eternal flames',
    imageUrl: '/pets/flame_wolf.png',
    animationUrl: '/pets/flame_wolf.gif',
    abilities: ['Fire Aura', 'Pack Leader', 'Burning Bite'],
    compatibleWarriors: ['fire-ronin', 'dragon-slayer', 'phoenix-emperor']
  },

  // Epic Pets (250-350 points)
  {
    id: 'void-serpent',
    name: 'Void Serpent',
    type: 'Dragon',
    rarity: 'Epic',
    cost: 250,
    description: 'An ancient serpent from the void realm',
    imageUrl: '/pets/void_serpent.png',
    animationUrl: '/pets/void_serpent.gif',
    abilities: ['Void Magic', 'Dimensional Shift', 'Dark Energy', 'Poison Immunity'],
    compatibleWarriors: ['void-master', 'shadow-ninja', 'shogun-supreme']
  },
  {
    id: 'celestial-tiger',
    name: 'Celestial Tiger',
    type: 'Tiger',
    rarity: 'Epic',
    cost: 300,
    description: 'A divine tiger blessed by the heavens',
    imageUrl: '/pets/celestial_tiger.png',
    animationUrl: '/pets/celestial_tiger.gif',
    abilities: ['Divine Blessing', 'Celestial Roar', 'Holy Strike', 'Purification'],
    compatibleWarriors: ['celestial-warrior', 'dragon-slayer', 'shogun-supreme']
  },
  {
    id: 'thunder-eagle',
    name: 'Thunder Eagle',
    type: 'Eagle',
    rarity: 'Epic',
    cost: 350,
    description: 'A legendary eagle that controls thunder',
    imageUrl: '/pets/thunder_eagle.png',
    animationUrl: '/pets/thunder_eagle.gif',
    abilities: ['Thunder Control', 'Lightning Speed', 'Storm Call', 'Electric Aura'],
    compatibleWarriors: ['storm-blade', 'celestial-warrior', 'phoenix-emperor']
  },

  // Legendary Pets (400-500 points)
  {
    id: 'ancient-dragon',
    name: 'Ancient Dragon',
    type: 'Dragon',
    rarity: 'Legendary',
    cost: 400,
    description: 'The most powerful dragon companion',
    imageUrl: '/pets/ancient_dragon.png',
    animationUrl: '/pets/ancient_dragon.gif',
    abilities: ['Dragon Breath', 'Ancient Wisdom', 'Scale Armor', 'Flight', 'Elemental Mastery'],
    compatibleWarriors: ['dragon-slayer', 'shogun-supreme', 'phoenix-emperor']
  },
  {
    id: 'phoenix-companion',
    name: 'Phoenix Companion',
    type: 'Phoenix',
    rarity: 'Legendary',
    cost: 500,
    description: 'An immortal phoenix that shares its rebirth power',
    imageUrl: '/pets/phoenix_companion.png',
    animationUrl: '/pets/phoenix_companion.gif',
    abilities: ['Rebirth', 'Healing Flames', 'Immortality', 'Phoenix Fire', 'Resurrection'],
    compatibleWarriors: ['phoenix-emperor', 'fire-ronin', 'celestial-warrior']
  }
];

export const getPetById = (petId: string): Pet | undefined => {
  return PETS.find(pet => pet.id === petId);
};

export const getCompatiblePets = (warriorId: string): Pet[] => {
  return PETS.filter(pet => pet.compatibleWarriors.includes(warriorId));
};

export const getPetRarityColor = (rarity: WarriorRarity): string => {
  switch (rarity) {
    case 'Common':
      return 'text-green-600 bg-green-100 border-green-300';
    case 'Rare':
      return 'text-blue-600 bg-blue-100 border-blue-300';
    case 'Epic':
      return 'text-purple-600 bg-purple-100 border-purple-300';
    case 'Legendary':
      return 'text-orange-600 bg-orange-100 border-orange-300';
    default:
      return 'text-gray-600 bg-gray-100 border-gray-300';
  }
};

export const getPetRarityGradient = (rarity: WarriorRarity): string => {
  switch (rarity) {
    case 'Common':
      return 'from-green-400 to-green-600';
    case 'Rare':
      return 'from-blue-400 to-blue-600';
    case 'Epic':
      return 'from-purple-400 to-purple-600';
    case 'Legendary':
      return 'from-orange-400 to-orange-600';
    default:
      return 'from-gray-400 to-gray-600';
  }
};