import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Shield, Smartphone, Award } from 'lucide-react';
import Button from '../common/Button';

interface AuthPromptProps {
  onSignUp: () => void;
  onSignIn: () => void;
  onDismiss: () => void;
}

const AuthPrompt: React.FC<AuthPromptProps> = ({ onSignUp, onSignIn, onDismiss }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Cloud className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">
            Unlock Cloud Sync
          </h3>
        </div>
        <button
          onClick={onDismiss}
          className="text-blue-400 hover:text-blue-600 text-xl"
        >
          ×
        </button>
      </div>

      <p className="text-blue-800 mb-4">
        Create an account to sync your progress across all devices and never lose your data!
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <span className="text-sm text-blue-700">Secure backup</span>
        </div>
        <div className="flex items-center space-x-2">
          <Smartphone className="w-5 h-5 text-blue-600" />
          <span className="text-sm text-blue-700">Multi-device sync</span>
        </div>
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-blue-600" />
          <span className="text-sm text-blue-700">Save achievements</span>
        </div>
        <div className="flex items-center space-x-2">
          <Cloud className="w-5 h-5 text-blue-600" />
          <span className="text-sm text-blue-700">Cloud storage</span>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button onClick={onSignUp} size="sm" className="flex-1">
          Create Account
        </Button>
        <Button onClick={onSignIn} variant="secondary" size="sm" className="flex-1">
          Sign In
        </Button>
      </div>
    </motion.div>
  );
};

export default AuthPrompt;