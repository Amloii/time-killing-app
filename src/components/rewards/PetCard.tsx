import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Check, Coins, Heart, Star } from 'lucide-react';
import { Pet } from '../../types';
import { getPetRarityColor, getPetRarityGradient } from '../../utils/pets';
import Button from '../common/Button';

interface PetCardProps {
  pet: Pet;
  owned: boolean;
  canAfford: boolean;
  isCompatible: boolean;
  onPurchase: (petId: string) => void;
  onSelect?: (petId: string) => void;
  isActive?: boolean;
  activeWarriorId?: string;
}

const PetCard: React.FC<PetCardProps> = ({
  pet,
  owned,
  canAfford,
  isCompatible,
  onPurchase,
  onSelect,
  isActive = false,
  activeWarriorId
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const rarityColors = getPetRarityColor(pet.rarity);
  const rarityGradient = getPetRarityGradient(pet.rarity);

  const handleImageError = () => {
    setImageError(true);
  };

  const canInteract = owned || (canAfford && isCompatible);

  return (
    <motion.div
      className={`relative bg-white rounded-lg shadow-lg overflow-hidden border-2 transition-all duration-300 ${
        isActive ? 'border-green-500 shadow-green-200' : 
        !isCompatible ? 'border-red-200 opacity-60' :
        'border-gray-200'
      } ${canInteract ? 'hover:shadow-xl hover:scale-105' : 'opacity-75'}`}
      whileHover={canInteract ? { y: -5 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Rarity Banner */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${rarityGradient}`} />
      
      {/* Compatibility indicator */}
      {!isCompatible && activeWarriorId && (
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
          INCOMPATIBLE
        </div>
      )}
      
      {/* Image Container */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {!imageError ? (
          <img
            src={pet.imageUrl}
            alt={pet.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ imageRendering: 'pixelated' }}
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 overflow-hidden rounded-full border-2 border-gray-400">
                <img
                  src="/0609.gif"
                  alt="Default Pet"
                  className="w-full h-full object-cover"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
              <span className="text-gray-600 text-sm">{pet.name}</span>
            </div>
          </div>
        )}
        
        {/* Status Overlay */}
        {!owned && (!canAfford || !isCompatible) && (
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
          <h3 className="font-bold text-gray-900 truncate">{pet.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${rarityColors}`}>
            {pet.rarity}
          </span>
        </div>
        
        <div className="flex items-center mb-2">
          <span className="text-sm text-gray-600 mr-2">Type:</span>
          <span className="text-sm font-medium text-blue-600">{pet.type}</span>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {pet.description}
        </p>
        
        {/* Abilities */}
        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-1">Abilities:</div>
          <div className="flex flex-wrap gap-1">
            {pet.abilities.slice(0, 3).map((ability, index) => (
              <span
                key={index}
                className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs"
              >
                {ability}
              </span>
            ))}
            {pet.abilities.length > 3 && (
              <span className="text-xs text-gray-500">+{pet.abilities.length - 3} more</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="font-bold text-gray-900">{pet.cost}</span>
          </div>
          
          {owned ? (
            onSelect && (
              <Button
                size="sm"
                variant={isActive ? "secondary" : "primary"}
                onClick={() => onSelect(pet.id)}
                disabled={!isCompatible}
                icon={isActive ? <Heart className="w-4 h-4" /> : undefined}
              >
                {isActive ? "Active" : isCompatible ? "Select" : "Incompatible"}
              </Button>
            )
          ) : (
            <Button
              size="sm"
              disabled={!canAfford || !isCompatible}
              onClick={() => onPurchase(pet.id)}
              icon={(!canAfford || !isCompatible) ? <Lock className="w-4 h-4" /> : undefined}
            >
              {!isCompatible ? "Incompatible" : canAfford ? "Purchase" : "Locked"}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PetCard;