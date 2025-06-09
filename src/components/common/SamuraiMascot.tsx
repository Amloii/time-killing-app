import React from 'react';
import { motion } from 'framer-motion';
import { Sword } from 'lucide-react';

interface SamuraiMascotProps {
  mood: 'ready' | 'focused' | 'victory' | 'defeat';
  size?: number;
}

const SamuraiMascot: React.FC<SamuraiMascotProps> = ({ mood, size = 200 }) => {
  // Mood-based animations and effects
  const moodConfig = {
    ready: { 
      animation: { 
        y: [0, -8, 0], 
        transition: { repeat: Infinity, duration: 2 } 
      },
      overlay: 'bg-green-500 bg-opacity-20',
      borderColor: 'border-green-400',
      showSword: true,
      label: 'Ready for Battle!',
      glowColor: 'rgba(34, 197, 94, 0.4)'
    },
    focused: { 
      animation: { 
        scale: [1, 1.05, 1], 
        transition: { repeat: Infinity, duration: 3 } 
      },
      overlay: 'bg-blue-500 bg-opacity-20',
      borderColor: 'border-blue-400',
      showSword: false,
      label: 'In the Zone',
      glowColor: 'rgba(59, 130, 246, 0.4)'
    },
    victory: { 
      animation: { 
        scale: [1, 1.15, 1], 
        rotate: [0, 8, -8, 0],
        transition: { repeat: Infinity, duration: 1.5 } 
      },
      overlay: 'bg-yellow-500 bg-opacity-30',
      borderColor: 'border-yellow-400',
      showSword: true,
      label: 'Victory!',
      glowColor: 'rgba(255, 215, 0, 0.5)'
    },
    defeat: { 
      animation: { 
        rotate: [0, 3, -3, 0], 
        transition: { repeat: Infinity, duration: 4 } 
      },
      overlay: 'bg-gray-500 bg-opacity-20',
      borderColor: 'border-gray-400',
      showSword: false,
      label: 'Defeated...',
      glowColor: 'rgba(107, 114, 128, 0.3)'
    },
  };
  
  const currentMood = moodConfig[mood];
  
  return (
    <motion.div
      className="flex flex-col items-center relative"
      animate={currentMood.animation}
    >
      {/* Battle Aura Effect - Much Larger */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${currentMood.glowColor} 0%, transparent 70%)`,
          width: `${size * 2}px`,
          height: `${size * 2}px`,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: -1,
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />
      
      {/* Warrior GIF Container - Much Bigger */}
      <div className="relative">
        <motion.div
          className={`relative rounded-full overflow-hidden border-8 ${currentMood.borderColor} shadow-2xl`}
          style={{ 
            width: `${size}px`, 
            height: `${size}px` 
          }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
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
          
          {/* Victory Sparkles - Bigger */}
          {mood === 'victory' && (
            <>
              <motion.div
                className="absolute top-4 right-4 text-yellow-400 text-3xl"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.4, 1]
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity },
                  scale: { duration: 1, repeat: Infinity }
                }}
              >
                ✨
              </motion.div>
              <motion.div
                className="absolute bottom-4 left-4 text-yellow-400 text-2xl"
                animate={{ 
                  rotate: -360,
                  scale: [1, 1.5, 1]
                }}
                transition={{ 
                  rotate: { duration: 1.5, repeat: Infinity },
                  scale: { duration: 0.8, repeat: Infinity }
                }}
              >
                ⭐
              </motion.div>
              <motion.div
                className="absolute top-1/2 left-2 text-yellow-400 text-xl"
                animate={{ 
                  y: [-10, 10, -10],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity 
                }}
              >
                💫
              </motion.div>
              <motion.div
                className="absolute top-1/4 right-2 text-yellow-400 text-xl"
                animate={{ 
                  x: [-5, 5, -5],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{ 
                  duration: 1.8, 
                  repeat: Infinity 
                }}
              >
                🌟
              </motion.div>
            </>
          )}
          
          {/* Focus Indicator - Bigger */}
          {mood === 'focused' && (
            <>
              <motion.div
                className="absolute inset-0 border-4 border-blue-400 rounded-full"
                animate={{ 
                  scale: [1, 1.15, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity 
                }}
              />
              <motion.div
                className="absolute inset-0 border-2 border-blue-300 rounded-full"
                animate={{ 
                  scale: [1.1, 1.25, 1.1],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity 
                }}
              />
            </>
          )}
          
          {/* Ready Mode Energy Rings */}
          {mood === 'ready' && (
            <>
              <motion.div
                className="absolute inset-0 border-3 border-green-400 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity 
                }}
              />
              <motion.div
                className="absolute top-2 right-2 text-green-400 text-xl"
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity 
                }}
              >
                ⚡
              </motion.div>
            </>
          )}
        </motion.div>
        
        {/* Mood Indicator Badge - Bigger */}
        <motion.div
          className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg ${
            mood === 'ready' ? 'bg-green-500' :
            mood === 'focused' ? 'bg-blue-500' :
            mood === 'victory' ? 'bg-yellow-500' :
            'bg-gray-500'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          {currentMood.label}
        </motion.div>
      </div>
      
      {/* Animated Sword - Bigger */}
      {currentMood.showSword && (
        <motion.div 
          className="mt-6 text-gray-700"
          animate={{
            rotate: mood === 'victory' ? [0, 15, -15, 0] : [0, 8, -8, 0],
            y: mood === 'victory' ? [0, -5, 0] : [0, -2, 0],
          }}
          transition={{
            duration: mood === 'victory' ? 1 : 2,
            repeat: Infinity,
          }}
        >
          <Sword size={size * 0.5} />
        </motion.div>
      )}
      
      {/* Additional Victory Effects */}
      {mood === 'victory' && (
        <motion.div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-4xl"
          animate={{
            y: [-20, -40, -20],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1
          }}
        >
          🎉
        </motion.div>
      )}
    </motion.div>
  );
};

export default SamuraiMascot;