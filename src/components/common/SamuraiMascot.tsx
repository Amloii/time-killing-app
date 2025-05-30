import React from 'react';
import { motion } from 'framer-motion';
import { Sword } from 'lucide-react';

interface SamuraiMascotProps {
  mood: 'ready' | 'focused' | 'victory' | 'defeat';
  size?: number;
}

const SamuraiMascot: React.FC<SamuraiMascotProps> = ({ mood, size = 100 }) => {
  // Expressions for different moods
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