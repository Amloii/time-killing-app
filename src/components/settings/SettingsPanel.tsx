import React, { useState } from 'react';
import { Settings, Volume2, Volume, Eye, EyeOff, Brain } from 'lucide-react';
import { useAppStore } from '../../store';
import Button from '../common/Button';
import LLMProviderSetup from './LLMProviderSetup';

interface SettingsPanelProps {
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const { settings, updateSettings, userProfile, updateGeminiApiKey } = useAppStore();
  const [showLLMSetup, setShowLLMSetup] = useState(false);
  
  const toggleSound = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };
  
  const toggleAnimations = () => {
    updateSettings({ showAnimations: !settings.showAnimations });
  };
  
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      updateSettings({ defaultSessionDuration: value });
    }
  };
  
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateGeminiApiKey(e.target.value);
  };
  
  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <Settings className="w-6 h-6 mr-2" />
            Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Default Battle Duration</h3>
            <input
              type="number"
              value={settings.defaultSessionDuration}
              onChange={handleDurationChange}
              min={5}
              max={60}
              step={5}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <p className="text-sm text-gray-500 mt-1">Minutes per battle session</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Sound Effects</h3>
            <Button
              onClick={toggleSound}
              variant="secondary"
              icon={settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <Volume className="w-5 h-5" />}
            >
              {settings.soundEnabled ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Animations</h3>
            <Button
              onClick={toggleAnimations}
              variant="secondary"
              icon={settings.showAnimations ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            >
              {settings.showAnimations ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">AI Provider</h3>
            <div className="mb-2">
              <div className="text-sm text-gray-600 mb-2">
                Current: {userProfile.llmProvider ? 
                  (userProfile.llmProvider === 'gemini' ? 'Google Gemini' : 'OpenAI') : 
                  'Not configured'
                }
              </div>
              <Button
                onClick={() => setShowLLMSetup(true)}
                variant="secondary"
                icon={<Brain className="w-5 h-5" />}
              >
                Configure AI Provider
              </Button>
            </div>
            <p className="text-sm text-gray-500">Required for AI task analysis and suggestions</p>
          </div>
        </div>
        
        <div className="mt-8">
          <Button onClick={onClose} fullWidth>
            Save & Close
          </Button>
        </div>
      </div>
      
      {showLLMSetup && (
        <LLMProviderSetup onClose={() => setShowLLMSetup(false)} />
      )}
    </>
  );
};

export default SettingsPanel;