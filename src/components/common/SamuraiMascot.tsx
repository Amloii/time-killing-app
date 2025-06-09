import React from 'react';
import { Sword } from 'lucide-react';

interface SamuraiMascotProps {
  mood: 'ready' | 'focused' | 'victory' | 'defeat';
  size?: number;
}

const SamuraiMascot: React.FC<SamuraiMascotProps> = ({ mood, size = 200 }) => {
  // Mood-based styling
  const moodConfig = {
    ready: { 
      borderColor: 'border-green-400',
      label: 'Ready for Battle!',
      accentColor: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    focused: { 
      borderColor: 'border-blue-400',
      label: 'In the Zone',
      accentColor: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    victory: { 
      borderColor: 'border-yellow-400',
      label: 'Victory!',
      accentColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    defeat: { 
      borderColor: 'border-gray-400',
      label: 'Defeated...',
      accentColor: 'text-gray-500',
      bgColor: 'bg-gray-50'
    },
  };
  
  const currentMood = moodConfig[mood];
  
  return (
    <div className="flex flex-col items-center relative">
      {/* Japanese Motifs Background */}
      <div className="relative">
        {/* Cherry Blossom Petals */}
        <div className="absolute -top-4 -left-4 text-pink-300 text-2xl">🌸</div>
        <div className="absolute -top-2 -right-6 text-pink-300 text-xl">🌸</div>
        <div className="absolute -bottom-3 -left-6 text-pink-300 text-lg">🌸</div>
        <div className="absolute -bottom-4 -right-4 text-pink-300 text-xl">🌸</div>
        
        {/* Traditional Japanese Symbols */}
        <div className="absolute top-1/4 -left-8 text-red-400 text-sm">⛩️</div>
        <div className="absolute top-3/4 -right-8 text-red-400 text-sm">⛩️</div>
        
        {/* Mountain Silhouettes */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-gray-400 text-lg">🗻</div>
        
        {/* Main Circular Frame */}
        <div className="relative">
          <div
            className={`relative rounded-full overflow-hidden border-8 ${currentMood.borderColor} shadow-2xl ${currentMood.bgColor}`}
            style={{ 
              width: `${size}px`, 
              height: `${size}px` 
            }}
          >
            {/* Warrior GIF */}
            <img
              src="/0609.gif"
              alt="Warrior Mascot"
              className="w-full h-full object-cover"
              style={{ 
                imageRendering: 'pixelated',
                filter: mood === 'defeat' ? 'grayscale(50%)' : 'none'
              }}
            />
            
            {/* Decorative Border Pattern */}
            <div className="absolute inset-0 border-4 border-red-200 rounded-full opacity-30"></div>
            <div className="absolute inset-2 border-2 border-red-300 rounded-full opacity-20"></div>
            
            {/* Victory Elements */}
            {mood === 'victory' && (
              <>
                <div className="absolute top-4 right-4 text-yellow-400 text-2xl">✨</div>
                <div className="absolute bottom-4 left-4 text-yellow-400 text-xl">⭐</div>
                <div className="absolute top-1/2 left-2 text-yellow-400 text-lg">💫</div>
                <div className="absolute top-1/4 right-2 text-yellow-400 text-lg">🌟</div>
              </>
            )}
            
            {/* Focus Rings */}
            {mood === 'focused' && (
              <>
                <div className="absolute inset-0 border-2 border-blue-400 rounded-full opacity-60"></div>
                <div className="absolute inset-4 border border-blue-300 rounded-full opacity-40"></div>
              </>
            )}
            
            {/* Ready Energy */}
            {mood === 'ready' && (
              <div className="absolute top-2 right-2 text-green-400 text-xl">⚡</div>
            )}
          </div>
          
          {/* Traditional Japanese Corner Decorations */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-l-4 border-t-4 border-red-400 opacity-60"></div>
          <div className="absolute -top-2 -right-2 w-6 h-6 border-r-4 border-t-4 border-red-400 opacity-60"></div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-4 border-b-4 border-red-400 opacity-60"></div>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-4 border-b-4 border-red-400 opacity-60"></div>
        </div>
        
        {/* Mood Indicator Badge */}
        <div
          className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg ${
            mood === 'focused' ? 'bg-blue-500' :
            mood === 'victory' ? 'bg-yellow-500' :
            mood === 'defeat' ? 'bg-gray-500' : 'bg-green-500'
          }`}
        >
          {mood === 'ready' ? '' : currentMood.label}
        </div>
        
        {/* Smaller Ready for Battle label positioned outside the GIF */}
        {mood === 'ready' && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-full text-xs font-medium text-white bg-green-500 shadow-md">
            Ready for Battle!
          </div>
        )}
      </div>
      
      {/* Static Sword for Ready and Victory modes */}
      {(mood === 'ready' || mood === 'victory') && (
        <div className={`mt-6 ${currentMood.accentColor}`}>
          <Sword size={size * 0.3} />
        </div>
      )}
      
      {/* Japanese Calligraphy Style Accent */}
    </div>
  );
};

export default SamuraiMascot;