import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useTheme } from '../context/ThemeContext';
import { Alert } from '../components/Alert';
import { PageLayout } from '../components';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { currentTheme, availableThemes, setTheme } = useTheme();
  const [anthropicApiKey, setAnthropicApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [wizardModeEnabled, setWizardModeEnabled] = useState(false);

  useEffect(() => {
    // Load saved API key on mount
    const savedKey = localStorage.getItem('anthropic_api_key');
    if (savedKey) {
      setAnthropicApiKey(savedKey);
      setApiKeySaved(true);
    }

    // Load wizard mode preference
    const wizardMode = localStorage.getItem('wizard_mode_enabled');
    setWizardModeEnabled(wizardMode === 'true');
  }, []);

  const handleWizardModeToggle = () => {
    const newValue = !wizardModeEnabled;
    setWizardModeEnabled(newValue);
    localStorage.setItem('wizard_mode_enabled', String(newValue));
  };

  const handleSaveApiKey = () => {
    if (!anthropicApiKey.trim()) {
      setApiKeyError('API key cannot be empty');
      return;
    }

    if (!anthropicApiKey.startsWith('sk-ant-')) {
      setApiKeyError('Invalid Anthropic API key format. Should start with "sk-ant-"');
      return;
    }

    localStorage.setItem('anthropic_api_key', anthropicApiKey);
    setApiKeySaved(true);
    setApiKeyError(null);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('anthropic_api_key');
    setAnthropicApiKey('');
    setApiKeySaved(false);
    setApiKeyError(null);
  };

  return (
    <PageLayout
      title="Settings"
      quickDescription="Manage your application preferences and design system."
      detailedDescription="Configure API keys for AI-powered features, manage your theme preferences, and adjust application settings. Your Anthropic API key is stored securely in your browser's local storage and is required for AI analysis features. You can also manage workspace data, clear integrations, and toggle wizard mode for guided workflows."
    >

      <div className="space-y-6">
        {/* API Keys Section */}
        <Card>
          <h3 className="mb-2">API Keys</h3>
          <p className="text-sm text-grey-600 mb-6">
            Configure API keys for AI-powered integration analysis and other features.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-grey-700 mb-2">
                Anthropic API Key
              </label>
              <p className="text-xs text-grey-500 mb-3">
                Used for AI-powered integration analysis. Get your API key from{' '}
                <a
                  href="https://console.anthropic.com/settings/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  console.anthropic.com
                </a>
              </p>

              {apiKeyError && (
                <Alert variant="error" className="mb-3">
                  {apiKeyError}
                </Alert>
              )}

              {apiKeySaved && !apiKeyError && (
                <Alert variant="success" className="mb-3">
                  API key saved successfully!
                </Alert>
              )}

              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={anthropicApiKey}
                    onChange={(e) => {
                      setAnthropicApiKey(e.target.value);
                      setApiKeySaved(false);
                      setApiKeyError(null);
                    }}
                    placeholder="sk-ant-..."
                    className="w-full px-4 py-2 border border-grey-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-grey-500 hover:text-grey-700"
                    title={showApiKey ? 'Hide API key' : 'Show API key'}
                  >
                    {showApiKey ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <Button onClick={handleSaveApiKey} variant="primary">
                  Save
                </Button>
                {anthropicApiKey && (
                  <Button onClick={handleClearApiKey} variant="outline">
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-yellow-600 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <h4 className="text-sm font-semibold text-yellow-900 mb-1">
                  Security Notice
                </h4>
                <p className="text-sm text-yellow-700">
                  Your API key is stored locally in your browser and is only used to make requests to integration providers on your behalf.
                  Never share your API key with others.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Navigation Mode */}
        <Card>
          <h3 className="mb-2">Navigation Mode</h3>
          <p className="text-sm text-grey-600 mb-6">
            Choose how you navigate through IntentR's development workflow.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-grey-50 border border-grey-200 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${wizardModeEnabled ? 'bg-blue-100' : 'bg-grey-200'}`}>
                    <svg
                      className={`w-6 h-6 ${wizardModeEnabled ? 'text-blue-600' : 'text-grey-500'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-grey-900">Wizard Mode</h4>
                    <p className="text-xs text-grey-600 mt-0.5">
                      Step-by-step guided navigation through the INTENT development workflow
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleWizardModeToggle}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  wizardModeEnabled ? 'bg-blue-600' : 'bg-grey-300'
                }`}
                role="switch"
                aria-checked={wizardModeEnabled}
                aria-label="Toggle wizard mode"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    wizardModeEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-blue-600 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">
                    About Navigation Modes
                  </h4>
                  <div className="text-sm text-blue-700 space-y-2">
                    <p>
                      <strong>Sidebar Navigation (Default):</strong> Access any page directly using the left sidebar. Best for experienced users who want quick, ad-hoc access.
                    </p>
                    <p>
                      <strong>Wizard Mode:</strong> A guided step-by-step experience with progress tracking. Ideal for new users or when following the complete INTENT workflow from Intent to Control Loop.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {wizardModeEnabled && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <p className="text-sm text-green-700">
                      Wizard Mode is enabled. Start the guided workflow now.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => navigate('/wizard/workspace')}
                  >
                    Start Wizard
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

      </div>
    </PageLayout>
  );
};
