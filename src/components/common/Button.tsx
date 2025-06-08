import React from 'react';
import { motion } from 'framer-motion';
import { CapacitorService } from '../../utils/capacitor';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
  icon,
}) => {
  const handleClick = async () => {
    if (onClick && !disabled) {
      await CapacitorService.hapticFeedback();
      onClick();
    }
  };

  const baseClasses = 'font-medium rounded-md flex items-center justify-center transition-all active:scale-95 touch-none';
  
  const variantClasses = {
    primary: 'bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 active:from-red-700 active:to-red-800 shadow-md hover:shadow-lg tap-highlight-transparent',
    secondary: 'bg-white bg-opacity-90 text-gray-800 hover:bg-gray-50 active:bg-gray-100 border border-gray-200 shadow-sm hover:shadow tap-highlight-transparent',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 tap-highlight-transparent',
  };
  
  const sizeClasses = {
    sm: 'text-sm py-1 px-3',
    md: 'text-base py-2 px-4',
    lg: 'text-lg py-3 px-6',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;