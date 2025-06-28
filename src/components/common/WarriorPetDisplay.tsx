import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Zap } from 'lucide-react';
import { useAppStore } from '../../store';
import { WARRIORS } from '../../utils/warriors';
import { getPetById } from '../../utils/pets';

interface WarriorPetDisplayProps {
  size?: 'sm' | 'md' | 'lg';
  showNames?: boolean;
  showBond?: boolean;
  className?: string;
}

const WarriorPetDisplay: React.FC<WarriorPetDisplayProps> = ({
  size = 'md',
  showNames = true,
  showBond = false,
  className = ''
}) => {
  const { getActiveWarriorPetPair } = useAppStore();
  const pair = getActiveWarriorPetPair();

  if (!pair?.warrior) {
    return (
      <div className={`flex items-center justify-center text-gray-500 ${className}`}>
        <span className="text-sm">No warrior selected</span>
      </div>
    );
  }

  const { warrior, pet } = pair;

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Warrior */}
      <div className="flex flex-col items-center">
        <motion.div
          className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-red-300 shadow-lg relative`}
          whileHover={{ scale: 1.05 }}
        >
          <img
            src={warrior.imageUrl}
            alt={warrior.name}
            className="w-full h-full object-cover"
            style={{ imageRendering: 'pixelated' }}
            onError={(e) => {
              e.currentTarget.src = '/0609.gif';
            }}
          />
          {/* Warrior rarity indicator */}
          <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600"></div>
        </motion.div>
        {showNames && (
          <span className={`${textSizes[size]} font-medium text-gray-800 mt-1 text-center`}>
            {warrior.name}
          </span>
        )}
      </div>

      {/* Bond indicator */}
      {pet && showBond && (
        <div className="flex flex-col items-center">
          <Heart className="w-4 h-4 text-red-500 animate-pulse" />
          <div className="flex space-x-1 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-2 h-2 ${i < 3 ? 'text-yellow-500' : 'text-gray-300'}`}
                fill="currentColor"
              />
            ))}
          </div>
        </div>
      )}

      {/* Pet */}
      {pet ? (
        <div className="flex flex-col items-center">
          <motion.div
            className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-blue-300 shadow-lg relative`}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={pet.imageUrl}
              alt={pet.name}
              className="w-full h-full object-cover"
              style={{ imageRendering: 'pixelated' }}
              onError={(e) => {
                e.currentTarget.src = '/0609.gif';
              }}
            />
            {/* Pet type indicator */}
            <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
          </motion.div>
          {showNames && (
            <span className={`${textSizes[size]} font-medium text-gray-800 mt-1 text-center`}>
              {pet.name}
            </span>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className={`${sizeClasses[size]} rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50`}>
            <Zap className="w-6 h-6 text-gray-400" />
          </div>
          {showNames && (
            <span className={`${textSizes[size]} text-gray-500 mt-1 text-center`}>
              No Pet
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default WarriorPetDisplay;