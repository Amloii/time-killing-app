import React from 'react';
import { useAppStore } from '../../store';
import { WARRIORS } from '../../utils/warriors';

interface SamuraiMascotProps {
  mood?: 'ready' | 'focused' | 'victory' | 'defeat';
  size?: number;
  useActiveWarrior?: boolean;
}

const SamuraiMascot: React.FC<SamuraiMascotProps> = ({ 
  mood = 'ready', 
  size = 200, 
  useActiveWarrior = false 
}) => {
  const { userProfile } = useAppStore();
  
  // Get the active warrior or use default
  const activeWarrior = useActiveWarrior && userProfile.activeWarrior 
    ? WARRIORS.find(w => w.id === userProfile.activeWarrior)
    : null;
  
  // Use warrior image if available, otherwise default GIF
  const imageSource = activeWarrior?.imageUrl || "/0609.gif";
  const altText = activeWarrior?.name || "Warrior Mascot";
  
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
      {/* Japanese Aesthetic Background Elements */}
      <div className="relative" style={{ width: `${size + 120}px`, height: `${size + 120}px` }}>
        
        {/* Traditional Japanese Wave Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path d="M20,100 Q60,80 100,100 T180,100" stroke="#dc2626" strokeWidth="2" fill="none" opacity="0.3"/>
            <path d="M20,120 Q60,100 100,120 T180,120" stroke="#dc2626" strokeWidth="1.5" fill="none" opacity="0.2"/>
            <path d="M20,80 Q60,60 100,80 T180,80" stroke="#dc2626" strokeWidth="1.5" fill="none" opacity="0.2"/>
          </svg>
        </div>
        
        {/* Cherry Blossom Petals - More Scattered */}
        <div className="absolute top-2 left-8 text-pink-300 text-2xl transform rotate-12">🌸</div>
        <div className="absolute top-6 right-4 text-pink-300 text-xl transform -rotate-12">🌸</div>
        <div className="absolute bottom-8 left-2 text-pink-300 text-lg transform rotate-45">🌸</div>
        <div className="absolute bottom-4 right-8 text-pink-300 text-xl transform -rotate-45">🌸</div>
        <div className="absolute top-1/3 left-0 text-pink-200 text-sm transform rotate-90">🌸</div>
        <div className="absolute top-2/3 right-0 text-pink-200 text-sm transform -rotate-90">🌸</div>
        
        {/* Traditional Torii Gates */}
        <div className="absolute top-4 left-1/4 text-red-500 text-lg opacity-60">⛩️</div>
        <div className="absolute bottom-6 right-1/4 text-red-500 text-lg opacity-60">⛩️</div>
        
        {/* Japanese Fans */}
        <div className="absolute top-1/4 right-2 text-red-400 text-xl transform rotate-45">🪭</div>
        <div className="absolute bottom-1/4 left-2 text-red-400 text-xl transform -rotate-45">🪭</div>
        
        {/* Mount Fuji Silhouettes */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-gray-400 text-2xl opacity-40">🗻</div>
        
        {/* Traditional Japanese Lanterns */}
        <div className="absolute top-1/2 left-1 text-orange-400 text-lg opacity-50">🏮</div>
        <div className="absolute top-1/2 right-1 text-orange-400 text-lg opacity-50">🏮</div>
        
        {/* Main Circular Frame - Centered */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div
            className={`relative rounded-full overflow-hidden border-8 ${currentMood.borderColor} shadow-2xl`}
            style={{ 
              width: `${size}px`, 
              height: `${size}px`,
              background: 'linear-gradient(135deg, #fef7f0 0%, #fdf2f8 50%, #fef3f2 100%)'
            }}
          >
            {/* Traditional Japanese Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <pattern id="seigaiha" patternUnits="userSpaceOnUse" width="20" height="10">
                  <path d="M0,10 Q5,0 10,10 Q15,0 20,10" stroke="#dc2626" strokeWidth="0.5" fill="none"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#seigaiha)"/>
              </svg>
            </div>
            
            {/* Warrior GIF */}
            <img
              src={imageSource}
              alt={altText}
              className="w-full h-full object-cover relative z-10"
              style={{ 
                imageRendering: 'pixelated',
                filter: mood === 'defeat' ? 'grayscale(50%)' : 'none'
              }}
              onError={(e) => {
                // Fallback to default GIF if warrior image fails to load
                const target = e.target as HTMLImageElement;
                if (target.src !== "/0609.gif") {
                  target.src = "/0609.gif";
                }
              }}
            />
            
            {/* Decorative Inner Borders with Japanese Style */}
            <div className="absolute inset-0 border-4 border-red-200 rounded-full opacity-30 z-20"></div>
            <div className="absolute inset-2 border-2 border-red-300 rounded-full opacity-20 z-20"></div>
            
            {/* Traditional Japanese Corner Ornaments */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-red-400 opacity-60 z-20"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-red-400 opacity-60 z-20"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-red-400 opacity-60 z-20"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-red-400 opacity-60 z-20"></div>
            
            {/* Victory Elements */}
            {mood === 'victory' && (
              <>
                <div className="absolute top-4 right-4 text-yellow-400 text-2xl z-30">✨</div>
                <div className="absolute bottom-4 left-4 text-yellow-400 text-xl z-30">⭐</div>
                <div className="absolute top-1/2 left-2 text-yellow-400 text-lg z-30">💫</div>
                <div className="absolute top-1/4 right-2 text-yellow-400 text-lg z-30">🌟</div>
              </>
            )}
            
            {/* Focus Rings */}
            {mood === 'focused' && (
              <>
                <div className="absolute inset-0 border-2 border-blue-400 rounded-full opacity-60 z-20"></div>
                <div className="absolute inset-4 border border-blue-300 rounded-full opacity-40 z-20"></div>
              </>
            )}
            
            {/* Ready Energy */}
            {mood === 'ready' && (
              <div className="absolute top-2 right-2 text-green-400 text-xl z-30">⚡</div>
            )}
          </div>
          
          {/* Mood Indicator Badge */}
          <div
            className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium text-white shadow-lg ${
              mood === 'focused' ? 'bg-blue-500' :
              mood === 'victory' ? 'bg-yellow-500' :
              mood === 'defeat' ? 'bg-gray-500' : 'bg-green-500'
            }`}
          >
            {activeWarrior?.name || currentMood.label}
          </div>
        </div>
        
        {/* Traditional Japanese Bamboo Elements */}
        <div className="absolute top-1/4 left-4 text-green-600 text-2xl opacity-40 transform rotate-12">🎋</div>
        <div className="absolute bottom-1/4 right-4 text-green-600 text-2xl opacity-40 transform -rotate-12">🎋</div>
        
        {/* Japanese Maple Leaves */}
        <div className="absolute top-3/4 left-6 text-red-400 text-lg opacity-50 transform rotate-30">🍁</div>
        <div className="absolute top-1/4 right-6 text-red-400 text-lg opacity-50 transform -rotate-30">🍁</div>
        
        {/* Active Warrior Name Display */}
      </div>
    </div>
  );
};

export default SamuraiMascot;