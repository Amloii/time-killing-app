import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Check, Coins } from 'lucide-react';
import { Warrior } from '../../types';
import { getRarityColor, getRarityGradient } from '../../utils/warriors';
import Button from '../common/Button';

interface WarriorCardProps {
  warrior: Warrior;
  owned: boolean;
  canAfford: boolean;
  onPurchase: (warriorId: string) => void;
  onSelect?: (warriorId: string) => void;
  isActive?: boolean;
}

const WarriorCard: React.FC<WarriorCardProps> = ({
  warrior,
  owned,
  canAfford,
  onPurchase,
  onSelect,
  isActive = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const rarityColors = getRarityColor(warrior.rarity);
  const rarityGradient = getRarityGradient(warrior.rarity);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.div
      className={`relative bg-white rounded-lg shadow-lg overflow-hidden border-2 transition-all duration-300 ${
        isActive ? 'border-green-500 shadow-green-200' : 'border-gray-200'
      } ${owned ? 'hover:shadow-xl' : canAfford ? 'hover:shadow-xl hover:scale-105' : 'opacity-75'}`}
      whileHover={owned || canAfford ? { y: -5 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Rarity Banner */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${rarityGradient}`} />
      
      {/* Image Container */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {!imageError ? (
          <img
            src={warrior.imageUrl}
            alt={warrior.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-400 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚔️</span>
              </div>
              <span className="text-gray-600 text-sm">{warrior.name}</span>
            </div>
          </div>
        )}
        
        {/* Status Overlay */}
        {!owned && !canAfford && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
        )}
        
        {owned && (
          <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
            <Check className="w-4 h-4" />
          </div>
        )}
        
        {isActive && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            ACTIVE
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-gray-900 truncate">{warrior.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${rarityColors}`}>
            {warrior.rarity}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {warrior.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="font-bold text-gray-900">{warrior.cost}</span>
          </div>
          
          {owned ? (
            onSelect && (
              <Button
                size="sm"
                variant={isActive ? "secondary" : "primary"}
                onClick={() => onSelect(warrior.id)}
              >
                {isActive ? "Active" : "Select"}
              </Button>
            )
          ) : (
            <Button
              size="sm"
              disabled={!canAfford}
              onClick={() => onPurchase(warrior.id)}
              icon={!canAfford ? <Lock className="w-4 h-4" /> : undefined}
            >
              {canAfford ? "Purchase" : "Locked"}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default WarriorCard;