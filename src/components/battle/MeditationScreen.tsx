import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Swords, Sparkles, Heart, Brain, Target } from 'lucide-react';
import Button from '../common/Button';
import SamuraiMascot from '../common/SamuraiMascot';

interface MeditationScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

const MEDITATION_TIPS = [
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Breathe Deeply",
    description: "Take slow, deep breaths to center your mind and reduce anxiety. Inhale for 4 counts, hold for 4, exhale for 6.",
    color: "from-blue-400 to-blue-600"
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Clear Your Mind",
    description: "Release any distracting thoughts. Focus only on the tasks ahead and trust in your preparation.",
    color: "from-purple-400 to-purple-600"
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Visualize Success",
    description: "Picture yourself completing each task with focus and efficiency. See yourself achieving your goals.",
    color: "from-green-400 to-green-600"
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Embrace the Challenge",
    description: "Welcome this battle as an opportunity to grow. Every task completed makes you stronger.",
    color: "from-yellow-400 to-yellow-600"
  }
];

const MeditationScreen: React.FC<MeditationScreenProps> = ({ onComplete, onSkip }) => {
  const [currentTip, setCurrentTip] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCount, setBreathCount] = useState(4);
  const [meditationTime, setMeditationTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setMeditationTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    let breathInterval: NodeJS.Timeout;
    
    if (isBreathing) {
      breathInterval = setInterval(() => {
        setBreathCount(prev => {
          if (prev <= 1) {
            setBreathPhase(current => {
              if (current === 'inhale') return 'hold';
              if (current === 'hold') return 'exhale';
              return 'inhale';
            });
            return current === 'exhale' ? 6 : 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(breathInterval);
  }, [isBreathing, breathPhase]);

  const startMeditation = () => {
    setIsActive(true);
    setIsBreathing(true);
  };

  const pauseMeditation = () => {
    setIsActive(false);
    setIsBreathing(false);
  };

  const resetMeditation = () => {
    setIsActive(false);
    setIsBreathing(false);
    setMeditationTime(0);
    setBreathPhase('inhale');
    setBreathCount(4);
  };

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % MEDITATION_TIPS.length);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathInstruction = () => {
    switch (breathPhase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
    }
  };

  const getBreathColor = () => {
    switch (breathPhase) {
      case 'inhale': return 'from-blue-400 to-blue-600';
      case 'hold': return 'from-yellow-400 to-yellow-600';
      case 'exhale': return 'from-green-400 to-green-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            className="text-4xl fight-time-heading text-gray-800 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Warrior Meditation
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 fight-time-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Prepare your mind and spirit for the battle ahead
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Meditation Controls */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <SamuraiMascot mood="focused" size={120} />
              </div>
              
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {formatTime(meditationTime)}
                </div>
                <div className="text-sm text-gray-500">Meditation Time</div>
              </div>
            </div>

            {/* Breathing Guide */}
            <div className="mb-8">
              <div className="text-center mb-4">
                <motion.div
                  className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${getBreathColor()} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                  animate={{
                    scale: breathPhase === 'inhale' ? 1.2 : breathPhase === 'hold' ? 1.1 : 0.9,
                  }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                >
                  {isBreathing ? breathCount : getBreathInstruction()}
                </motion.div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-700 mb-1">
                  {getBreathInstruction()}
                </div>
                <div className="text-sm text-gray-500">
                  {isBreathing ? `${breathCount} seconds` : 'Click start to begin'}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4 mb-6">
              {!isActive ? (
                <Button
                  onClick={startMeditation}
                  icon={<Play className="w-5 h-5" />}
                  size="lg"
                >
                  Start Meditation
                </Button>
              ) : (
                <Button
                  onClick={pauseMeditation}
                  variant="secondary"
                  icon={<Pause className="w-5 h-5" />}
                  size="lg"
                >
                  Pause
                </Button>
              )}
              
              <Button
                onClick={resetMeditation}
                variant="secondary"
                icon={<RotateCcw className="w-5 h-5" />}
                size="lg"
              >
                Reset
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={onSkip}
                variant="secondary"
                fullWidth
              >
                Skip Meditation
              </Button>
              
              <Button
                onClick={onComplete}
                icon={<Swords className="w-5 h-5" />}
                fullWidth
                disabled={meditationTime < 30}
              >
                {meditationTime < 30 ? `${30 - meditationTime}s remaining` : 'Begin Battle'}
              </Button>
            </div>
            
            {meditationTime < 30 && (
              <p className="text-xs text-gray-500 text-center mt-2">
                Minimum 30 seconds of meditation recommended
              </p>
            )}
          </motion.div>

          {/* Meditation Tips */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 fight-time-heading">
                Warrior Wisdom
              </h3>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTip}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6"
                >
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${MEDITATION_TIPS[currentTip].color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                    {MEDITATION_TIPS[currentTip].icon}
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    {MEDITATION_TIPS[currentTip].title}
                  </h4>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {MEDITATION_TIPS[currentTip].description}
                  </p>
                </motion.div>
              </AnimatePresence>
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {MEDITATION_TIPS.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentTip ? 'bg-red-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <Button
                  onClick={nextTip}
                  variant="secondary"
                  size="sm"
                >
                  Next Tip
                </Button>
              </div>
            </div>

            {/* Inspirational Quote */}
            <motion.div
              className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">🥋</div>
                <blockquote className="text-lg font-medium text-gray-800 mb-2 italic">
                  "The warrior and the artist live by the same code of necessity, which dictates that the battle must be fought anew every day."
                </blockquote>
                <cite className="text-sm text-gray-600">— Steven Pressfield</cite>
              </div>
            </motion.div>

            {/* Battle Preparation Checklist */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 fight-time-heading">
                Pre-Battle Checklist
              </h3>
              
              <div className="space-y-3">
                {[
                  'Mind is clear and focused',
                  'Breathing is calm and steady',
                  'Goals are visualized',
                  'Distractions are minimized',
                  'Energy is centered'
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MeditationScreen;