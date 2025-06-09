import React from 'react';
import { motion } from 'framer-motion';
import { Sword } from 'lucide-react';

interface SamuraiMascotProps {
  mood: 'ready' | 'focused' | 'victory' | 'defeat';
  size?: number;
}

const SamuraiMascot: React.FC<SamuraiMascotProps> = ({ mood, size = 100 }) => {
  // Mood-based animations and effects
  const moodConfig = {
    ready: { 
      animation: { 
        y: [0, -5, 0], 
        transition: { repeat: Infinity, duration: 2 } 
      },
      overlay: 'bg-green-500 bg-opacity-20',
      borderColor: 'border-green-400',
      showSword: true,
      label: 'Ready for Battle!'
    },
    focused: { 
      animation: { 
        scale: [1, 1.02, 1], 
        transition: { repeat: Infinity, duration: 3 } 
      },
      overlay: 'bg-blue-500 bg-opacity-20',
      borderColor: 'border-blue-400',
      showSword: false,
      label: 'In the Zone'
    },
    victory: { 
      animation: { 
        scale: [1, 1.1, 1], 
        rotate: [0, 5, -5, 0],
        transition: { repeat: Infinity, duration: 1.5 } 
      },
      overlay: 'bg-yellow-500 bg-opacity-30',
      borderColor: 'border-yellow-400',
      showSword: true,
      label: 'Victory!'
    },
    defeat: { 
      animation: { 
        rotate: [0, 2, -2, 0], 
        transition: { repeat: Infinity, duration: 4 } 
      },
      overlay: 'bg-gray-500 bg-opacity-20',
      borderColor: 'border-gray-400',
      showSword: false,
      label: 'Defeated...'
    },
  };
  
  const currentMood = moodConfig[mood];
  
  return (
    <motion.div
      className="flex flex-col items-center"
      animate={currentMood.animation}
    >
      {/* Warrior GIF Container */}
      <div className="relative">
        <motion.div
          className={`relative rounded-full overflow-hidden border-4 ${currentMood.borderColor} shadow-lg`}
          style={{ 
            width: `${size}px`, 
            height: `${size}px` 
          }}
          whileHover={{ scale: 1.05 }}
        >
          {/* Main Warrior GIF */}
          <img
            src="/0609.gif"
            alt="Warrior Mascot"
            className="w-full h-full object-cover"
            style={{ 
              imageRendering: 'pixelated',
              filter: mood === 'defeat' ? 'grayscale(50%)' : 'none'
            }}
          />
          
          {/* Mood Overlay */}
          <div className={`absolute inset-0 ${currentMood.overlay} mix-blend-multiply`} />
          
          {/* Victory Sparkles */}
          {mood === 'victory' && (
            <>
              <motion.div
                className="absolute top-2 right-2 text-yellow-400 text-lg"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity },
                  scale: { duration: 1, repeat: Infinity }
                }}
              >
                ✨
              </motion.div>
              <motion.div
                className="absolute bottom-2 left-2 text-yellow-400 text-sm"
                animate={{ 
                  rotate: -360,
                  scale: [1, 1.3, 1]
                }}
                transition={{ 
                  rotate: { duration: 1.5, repeat: Infinity },
                  scale: { duration: 0.8, repeat: Infinity }
                }}
              >
                ⭐
              </motion.div>
            </>
          )}
          
          {/* Focus Indicator */}
          {mood === 'focused' && (
            <motion.div
              className="absolute inset-0 border-2 border-blue-400 rounded-full"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity 
              }}
            />
          )}
        </motion.div>
        
        {/* Mood Indicator Badge */}
        <motion.div
          className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-full text-xs font-bold text-white shadow-md ${
            mood === 'ready' ? 'bg-green-500' :
            mood === 'focused' ? 'bg-blue-500' :
            mood === 'victory' ? 'bg-yellow-500' :
            'bg-gray-500'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {currentMood.label}
        </motion.div>
      </div>
      
      {/* Animated Sword */}
      {currentMood.showSword && (
        <motion.div 
          className="mt-4 text-gray-700"
          animate={{
            rotate: mood === 'victory' ? [0, 10, -10, 0] : [0, 5, -5, 0],
          }}
          transition={{
            duration: mood === 'victory' ? 1 : 2,
            repeat: Infinity,
          }}
        >
          <Sword size={size * 0.4} />
        </motion.div>
      )}
      
      {/* Battle Aura Effect */}
      {(mood === 'ready' || mood === 'victory') && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${
              mood === 'victory' ? 'rgba(255, 215, 0, 0.3)' : 'rgba(34, 197, 94, 0.2)'
            } 0%, transparent 70%)`,
            width: `${size * 1.5}px`,
            height: `${size * 1.5}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: -1,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />
      )}
    </motion.div>
  );
};

export default SamuraiMascot;