import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const baseClasses = 'bg-white bg-opacity-95 backdrop-blur-sm border border-gray-100 rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200';
  
  return (
    <motion.div
      className={`${baseClasses} ${className}`}
      whileHover={onClick ? { y: -2, scale: 1.02 } : { y: -1 }}
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

export default Card;