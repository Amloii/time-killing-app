import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Star, Zap } from 'lucide-react';
import { PointsBreakdown } from '../../utils/pointsCalculator';

interface PointsEarnedNotificationProps {
  pointsBreakdown: PointsBreakdown | null;
  onClose: () => void;
}

const PointsEarnedNotification: React.FC<PointsEarnedNotificationProps> = ({
  pointsBreakdown,
  onClose
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (pointsBreakdown) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [pointsBreakdown, onClose]);

  if (!pointsBreakdown) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-4 rounded-lg shadow-xl border-2 border-yellow-300 max-w-sm w-full mx-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Coins className="w-6 h-6" />
              </motion.div>
              <span className="font-bold text-lg">Points Earned!</span>
            </div>
            <motion.div
              className="text-2xl font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              +{pointsBreakdown.total}
            </motion.div>
          </div>
          
          <div className="space-y-1 text-sm">
            {pointsBreakdown.breakdown.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center space-x-2"
              >
                {item.includes('bonus') ? (
                  <Star className="w-3 h-3" />
                ) : item.includes('streak') ? (
                  <Zap className="w-3 h-3" />
                ) : (
                  <Coins className="w-3 h-3" />
                )}
                <span>{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PointsEarnedNotification;