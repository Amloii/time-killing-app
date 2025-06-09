import React from 'react';
import { motion } from 'framer-motion';
import { Sword } from 'lucide-react';

interface SamuraiMascotProps {
  mood: 'ready' | 'focused' | 'victory' | 'defeat';
  size?: number;
  useAnimation?: boolean;
}

const SamuraiMascot: React.FC<SamuraiMascotProps> = ({ mood, size = 100, useAnimation = true }) => {
  // You can replace this URL with your Google Drive GIF URL
  // To get a direct link from Google Drive:
  // 1. Make sure the file is publicly viewable
  // 2. Get the file ID from your URL: 1FMzxT69VHQu-JN3ZTwdG2ywiror7WUcE
  // 3. Use this format: https://drive.google.com/uc?export=view&id=FILE_ID
  const animationGifUrl = "https://drive.google.com/uc?export=view&id=1FMzxT69VHQu-JN3ZTwdG2ywiror7WUcE";
  
  // Fallback expressions for different moods (used if GIF fails to load)
  const expressions = {
    ready: { 
      eyes: '^ ^', 
      mouth: 'ω', 
      color: 'text-red-600',
      animation: { 
        y: [0, -5, 0], 
        transition: { repeat: Infinity, duration: 2 } 
      }
    },
    focused: { 
      eyes: '• •', 
      mouth: '—', 
      color: 'text-blue-600',
      animation: { 
        rotate: [-1, 1, -1], 
        transition: { repeat: Infinity, duration: 3 } 
      }
    },
    victory: { 
      eyes: '^ ^', 
      mouth: 'ᴥ', 
      color: 'text-green-600',
      animation: { 
        scale: [1, 1.1, 1], 
        transition: { repeat: Infinity, duration: 1.5 } 
      }
    },
    defeat: { 
      eyes: '> <', 
      mouth: 'o', 
      color: 'text-gray-600',
      animation: { 
        rotate: [0, 5, 0, -5, 0], 
        transition: { repeat: Infinity, duration: 4 } 
      }
    },
  };
  
  const currentExpression = expressions[mood];
  const [gifLoaded, setGifLoaded] = React.useState(false);
  const [gifError, setGifError] = React.useState(false);
  
  // If we want to use the animated GIF instead of the custom mascot
  if (useAnimation && !gifError) {
    return (
      <motion.div
        className="flex flex-col items-center"
        animate={currentExpression.animation}
      >
        <div 
          style={{ 
            width: `${size}px`, 
            height: `${size}px` 
          }}
          className="relative overflow-hidden rounded-full border-4 border-gray-900 bg-white"
        >
          <img
            src={animationGifUrl}
            alt="Warrior Animation"
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              gifLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setGifLoaded(true)}
            onError={() => {
              setGifError(true);
              console.log('Failed to load warrior animation GIF, falling back to custom mascot');
            }}
          />
          
          {/* Loading placeholder */}
          {!gifLoaded && !gifError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          )}
        </div>
        
        {/* Mood indicator */}
        <div className={`mt-2 text-sm font-medium ${currentExpression.color}`}>
          {mood.charAt(0).toUpperCase() + mood.slice(1)}
        </div>
        
        {/* Sword for certain moods */}
        {(mood === 'ready' || mood === 'victory') && (
          <div className="mt-2 text-gray-700">
            <Sword size={size * 0.4} />
          </div>
        )}
      </motion.div>
    );
  }
  
  // Fallback to original custom mascot design
  return (
    <motion.div
      className={`flex flex-col items-center ${currentExpression.color}`}
      animate={currentExpression.animation}
    >
      {/* Helmet */}
      <div 
        className="bg-gray-900 rounded-t-full w-full" 
        style={{ 
          width: `${size * 0.8}px`, 
          height: `${size * 0.4}px` 
        }}
      >
        <div 
          className="bg-red-600 h-1/4 w-full border-b border-gray-700"
          style={{ borderRadius: `${size * 0.4}px ${size * 0.4}px 0 0` }}
        />
      </div>
      
      {/* Face */}
      <div 
        className="bg-white rounded-full flex flex-col items-center justify-center border-2 border-gray-900"
        style={{ 
          width: `${size}px`, 
          height: `${size}px` 
        }}
      >
        {/* Eyes */}
        <div 
          className="text-center font-bold"
          style={{ fontSize: `${size * 0.2}px` }}
        >
          {currentExpression.eyes}
        </div>
        
        {/* Mouth */}
        <div 
          className="text-center font-bold"
          style={{ fontSize: `${size * 0.25}px` }}
        >
          {currentExpression.mouth}
        </div>
      </div>
      
      {/* Sword */}
      {(mood === 'ready' || mood === 'victory') && (
        <div className="mt-2 text-gray-700">
          <Sword size={size * 0.4} />
        </div>
      )}
    </motion.div>
  );
};

export default SamuraiMascot;