import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, UserPlus, Shield, Cloud, Award } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

interface SignUpFormProps {
  onBack: () => void;
  onSuccess: () => void;
  onSwitchToSignIn: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onBack, onSuccess, onSwitchToSignIn }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [step, setStep] = useState<'benefits' | 'form'>('benefits');

  const { signUp } = useAuth();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const { error } = await signUp(formData.email, formData.password);
      if (!error) {
        onSuccess();
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (step === 'benefits') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 lg:p-8 mx-4 sm:mx-0">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4 sm:mb-6 p-2 -ml-2 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Join Fight Mode
            </h1>
            <p className="text-sm sm:text-base text-gray-600 px-2">
              Unlock the full potential of your productivity journey
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Cloud className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                  Cloud Synchronization
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  Access your tasks, progress, and achievements from any device. Never lose your data again.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                  Secure Backup
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  Your data is automatically backed up and protected with enterprise-grade security.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                  Achievement Tracking
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  Keep your warrior collection, points, and streaks safe across all your devices.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <Button
              onClick={() => setStep('form')}
              fullWidth
              size="md"
              icon={<UserPlus className="w-5 h-5" />}
            >
              Create Your Account
            </Button>
            
            <div className="text-center">
              <span className="text-gray-600 text-xs sm:text-sm">Already have an account? </span>
              <button
                onClick={onSwitchToSignIn}
                className="text-red-600 hover:text-red-700 font-medium text-xs sm:text-sm"
              >
                Sign in instead
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-lg shadow-xl p-4 sm:p-6 lg:p-8 mx-4 sm:mx-0"
      >
        <button
          onClick={() => setStep('benefits')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4 sm:mb-6 p-2 -ml-2 rounded-lg hover:bg-gray-50"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-sm sm:text-base text-gray-600 px-2">
            Join thousands of productive warriors
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm sm:text-base ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email address"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm sm:text-base ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            <div className="mt-1 sm:mt-2 text-xs text-gray-500">
              Must contain uppercase, lowercase, and number
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm sm:text-base ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs sm:text-sm text-gray-700">
                <p className="font-medium mb-1">Your data is secure</p>
                <p className="leading-relaxed">We use industry-standard encryption to protect your information and never share your data with third parties.</p>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            size="md"
            disabled={loading}
            icon={<UserPlus className="w-5 h-5" />}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <span className="text-gray-600 text-xs sm:text-sm">Already have an account? </span>
          <button
            onClick={onSwitchToSignIn}
            className="text-red-600 hover:text-red-700 font-medium text-xs sm:text-sm"
          >
            Sign in
          </button>
        </div>

        <div className="mt-4 sm:mt-6 text-xs text-gray-500 text-center leading-relaxed px-2">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpForm;