import React from 'react';
import { Settings, Volume2, Volume, Eye, EyeOff } from 'lucide-react';
import { useAppStore } from '../../store';
import Button from '../common/Button';

interface SettingsPanelProps {
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const { settings, updateSettings, userProfile, updateGeminiApiKey } = useAppStore();
  
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
          <h3 className="text-lg font-medium mb-2">Gemini API Key</h3>
          <input
            type="password"
            value={userProfile.geminiApiKey || ''}
            onChange={handleApiKeyChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your Gemini API key"
          />
          <p className="text-sm text-gray-500 mt-1">Required for AI task analysis</p>
        </div>
      </div>
      
      <div className="mt-8">
        <Button onClick={onClose} fullWidth>
          Save & Close
        </Button>
      </div>
    </div>
  );
};

export default SettingsPanel;