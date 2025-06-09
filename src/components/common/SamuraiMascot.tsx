import React from 'react';
import { motion } from 'framer-motion';
import { Sword } from 'lucide-react';

interface SamuraiMascotProps {
  mood: 'ready' | 'focused' | 'victory' | 'defeat';
  size?: number;
  useAnimation?: boolean;
}

const SamuraiMascot: React.FC<SamuraiMascotProps> = ({ mood, size = 100, useAnimation = true }) => {
  // Simple animated GIF as base64 - this is a small spinning ninja star animation
  // You can replace this with any GIF converted to base64
  const animatedGifBase64 = "data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wjRLEuQRNnGt7QpVdNhHJBkaK0VGJQCdHjyOl5Q2FizkVDkzNzuAYrXTYqwUAIfkECQoAAAAsAAAAABAAEAAAAzQIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wjRLEuQRNnGt7QpVdNhHJBkaK0VGJQCdHjyOl5Q2FizkVDkzNzuAYrXTYqwUAOw==";
  
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
          className="relative overflow-hidden rounded-full border-4 border-gray-900 bg-gradient-to-br from-red-100 to-red-200 shadow-lg"
        >
          <img
            src={animatedGifBase64}
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
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          )}
          
          {/* Overlay effect based on mood */}
          <div className={`absolute inset-0 rounded-full ${
            mood === 'victory' ? 'bg-green-400 bg-opacity-20' :
            mood === 'defeat' ? 'bg-gray-400 bg-opacity-30' :
            mood === 'focused' ? 'bg-blue-400 bg-opacity-20' :
            'bg-red-400 bg-opacity-10'
          }`} />
        </div>
        
        {/* Mood indicator */}
        <div className={`mt-2 text-sm font-bold ${currentExpression.color} bg-white px-2 py-1 rounded-full shadow-sm`}>
          {mood.charAt(0).toUpperCase() + mood.slice(1)}
        </div>
        
        {/* Sword for certain moods */}
        {(mood === 'ready' || mood === 'victory') && (
          <motion.div 
            className="mt-2 text-gray-700"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Sword size={size * 0.4} />
          </motion.div>
        )}
        
        {/* Special effects for victory */}
        {mood === 'victory' && (
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <span className="text-2xl">✨</span>
          </motion.div>
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
        className="bg-gray-900 rounded-t-full w-full shadow-lg" 
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
        className="bg-white rounded-full flex flex-col items-center justify-center border-4 border-gray-900 shadow-lg"
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
        <motion.div 
          className="mt-2 text-gray-700"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Sword size={size * 0.4} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default SamuraiMascot;