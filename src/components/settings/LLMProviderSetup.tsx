import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Key, CheckCircle, AlertCircle, Loader, Settings as SettingsIcon } from 'lucide-react';
import { LLM_PROVIDERS, getDefaultSettings } from '../../utils/llm/providers';
import { validateApiKey } from '../../utils/llm/validation';
import { useAppStore } from '../../store';
import Button from '../common/Button';
import { toast } from 'sonner';

interface LLMProviderSetupProps {
  onClose: () => void;
}

const LLMProviderSetup: React.FC<LLMProviderSetupProps> = ({ onClose }) => {
  const { userProfile, updateLLMProvider, updateLLMSettings } = useAppStore();
  const [selectedProvider, setSelectedProvider] = useState<'gemini' | 'openai'>(
    userProfile.llmProvider || 'gemini'
  );
  const [apiKeys, setApiKeys] = useState({
    gemini: userProfile.geminiApiKey || '',
    openai: userProfile.openaiApiKey || '',
  });
  const [validationStatus, setValidationStatus] = useState<{
    [key: string]: 'idle' | 'validating' | 'valid' | 'invalid';
  }>({});
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [settings, setSettings] = useState(
    userProfile.llmSettings || getDefaultSettings(selectedProvider) || {
      temperature: 0.7,
      maxTokens: 4096,
      model: 'gemini-2.0-flash-lite',
      outputFormat: 'json' as const,
      enableUsageMonitoring: true,
    }
  );

  const handleProviderChange = (provider: 'gemini' | 'openai') => {
    setSelectedProvider(provider);
    const defaultSettings = getDefaultSettings(provider);
    if (defaultSettings) {
      setSettings(defaultSettings);
    }
  };

  const handleApiKeyChange = (provider: 'gemini' | 'openai', value: string) => {
    setApiKeys(prev => ({ ...prev, [provider]: value }));
    setValidationStatus(prev => ({ ...prev, [provider]: 'idle' }));
    setValidationErrors(prev => ({ ...prev, [provider]: '' }));
  };

  const validateKey = async (provider: 'gemini' | 'openai') => {
    const apiKey = apiKeys[provider];
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    setValidationStatus(prev => ({ ...prev, [provider]: 'validating' }));
    
    try {
      const result = await validateApiKey(provider, apiKey);
      
      if (result.isValid) {
        setValidationStatus(prev => ({ ...prev, [provider]: 'valid' }));
        setValidationErrors(prev => ({ ...prev, [provider]: '' }));
        toast.success(`${provider === 'gemini' ? 'Gemini' : 'OpenAI'} API key validated successfully!`);
      } else {
        setValidationStatus(prev => ({ ...prev, [provider]: 'invalid' }));
        setValidationErrors(prev => ({ ...prev, [provider]: result.error || 'Validation failed' }));
        toast.error(result.error || 'API key validation failed');
      }
    } catch (error) {
      setValidationStatus(prev => ({ ...prev, [provider]: 'invalid' }));
      setValidationErrors(prev => ({ ...prev, [provider]: 'Network error during validation' }));
      toast.error('Network error during validation');
    }
  };

  const handleSave = () => {
    const currentApiKey = apiKeys[selectedProvider];
    const currentStatus = validationStatus[selectedProvider];
    
    if (!currentApiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }
    
    if (currentStatus !== 'valid') {
      toast.error('Please validate your API key first');
      return;
    }

    // Update provider and keys
    updateLLMProvider(selectedProvider, apiKeys.gemini, apiKeys.openai);
    updateLLMSettings(settings);
    
    toast.success('LLM settings saved successfully!');
    onClose();
  };

  const currentProvider = LLM_PROVIDERS.find(p => p.id === selectedProvider);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Brain className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">LLM Provider Setup</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Configure your AI provider for task analysis and suggestions
          </p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Provider Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Choose Your AI Provider</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LLM_PROVIDERS.map((provider) => (
                <motion.div
                  key={provider.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedProvider === provider.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleProviderChange(provider.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{provider.name}</h4>
                    {selectedProvider === provider.id && (
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {provider.models.length} models available
                  </p>
                  <p className="text-xs text-gray-500">
                    Max tokens: {provider.maxTokens.toLocaleString()}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* API Key Configuration */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">API Key Configuration</h3>
            
            {LLM_PROVIDERS.map((provider) => (
              <div key={provider.id} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {provider.name} API Key
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="password"
                      value={apiKeys[provider.id]}
                      onChange={(e) => handleApiKeyChange(provider.id, e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`Enter your ${provider.name} API key`}
                    />
                    {validationStatus[provider.id] === 'valid' && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                    )}
                    {validationStatus[provider.id] === 'invalid' && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5" />
                    )}
                  </div>
                  <Button
                    onClick={() => validateKey(provider.id)}
                    disabled={!apiKeys[provider.id].trim() || validationStatus[provider.id] === 'validating'}
                    variant="secondary"
                    icon={
                      validationStatus[provider.id] === 'validating' ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )
                    }
                  >
                    {validationStatus[provider.id] === 'validating' ? 'Validating...' : 'Validate'}
                  </Button>
                </div>
                {validationErrors[provider.id] && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors[provider.id]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Advanced Settings */}
          <div className="mb-6">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <SettingsIcon className="w-4 h-4 mr-2" />
              Advanced Settings
            </button>
            
            {showAdvanced && currentProvider && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model
                    </label>
                    <select
                      value={settings.model}
                      onChange={(e) => setSettings(prev => ({ ...prev, model: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      {currentProvider.models.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name} (${model.costPer1kTokens}/1k tokens)
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Temperature ({settings.temperature})
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={settings.temperature}
                      onChange={(e) => setSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Tokens
                    </label>
                    <input
                      type="number"
                      min="100"
                      max={currentProvider.maxTokens}
                      value={settings.maxTokens}
                      onChange={(e) => setSettings(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Output Format
                    </label>
                    <select
                      value={settings.outputFormat}
                      onChange={(e) => setSettings(prev => ({ ...prev, outputFormat: e.target.value as 'json' | 'text' }))}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="json">JSON</option>
                      <option value="text">Text</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.enableUsageMonitoring}
                      onChange={(e) => setSettings(prev => ({ ...prev, enableUsageMonitoring: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Enable usage monitoring</span>
                  </label>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Configuration
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default LLMProviderSetup;