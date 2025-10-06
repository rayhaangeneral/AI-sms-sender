import { useState, useEffect } from 'react';
import { Save, Key, Phone } from 'lucide-react';
import { getApiKeys, saveApiKeys } from '../utils/storage';

function SettingsPage() {
  const [apiKeys, setApiKeys] = useState({
    groq: '',
    openai: '',
    ollama: { apiKey: '', baseUrl: 'http://localhost:11434' },
    anthropic: '',
    openrouter: '',
    twilio: { accountSid: '', authToken: '', phoneNumber: '' }
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const keys = getApiKeys();
    setApiKeys(keys);
  }, []);

  const handleSave = () => {
    saveApiKeys(apiKeys);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateField = (provider, field, value) => {
    if (typeof apiKeys[provider] === 'object') {
      setApiKeys({
        ...apiKeys,
        [provider]: { ...apiKeys[provider], [field]: value }
      });
    } else {
      setApiKeys({ ...apiKeys, [provider]: value });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Key className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-gray-900">API Settings</h2>
        </div>

        <div className="space-y-6">
          {/* AI Providers Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Model Providers</h3>
            <div className="space-y-4">
              {/* Groq */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Groq API Key
                </label>
                <input
                  type="password"
                  value={apiKeys.groq}
                  onChange={(e) => updateField('groq', null, e.target.value)}
                  placeholder="gsk_..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* OpenAI */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  value={apiKeys.openai}
                  onChange={(e) => updateField('openai', null, e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Ollama */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Ollama (Self-hosted)</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base URL
                    </label>
                    <input
                      type="text"
                      value={apiKeys.ollama.baseUrl}
                      onChange={(e) => updateField('ollama', 'baseUrl', e.target.value)}
                      placeholder="http://localhost:11434"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key (Optional)
                    </label>
                    <input
                      type="password"
                      value={apiKeys.ollama.apiKey}
                      onChange={(e) => updateField('ollama', 'apiKey', e.target.value)}
                      placeholder="Leave blank if not required"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Anthropic */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anthropic API Key
                </label>
                <input
                  type="password"
                  value={apiKeys.anthropic}
                  onChange={(e) => updateField('anthropic', null, e.target.value)}
                  placeholder="sk-ant-..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* OpenRouter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OpenRouter API Key
                </label>
                <input
                  type="password"
                  value={apiKeys.openrouter}
                  onChange={(e) => updateField('openrouter', null, e.target.value)}
                  placeholder="sk-or-..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Twilio Section */}
          <div className="border-t pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-gray-900">Twilio Configuration</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account SID
                </label>
                <input
                  type="text"
                  value={apiKeys.twilio.accountSid}
                  onChange={(e) => updateField('twilio', 'accountSid', e.target.value)}
                  placeholder="AC..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auth Token
                </label>
                <input
                  type="password"
                  value={apiKeys.twilio.authToken}
                  onChange={(e) => updateField('twilio', 'authToken', e.target.value)}
                  placeholder="Your auth token"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twilio Phone Number
                </label>
                <input
                  type="text"
                  value={apiKeys.twilio.phoneNumber}
                  onChange={(e) => updateField('twilio', 'phoneNumber', e.target.value)}
                  placeholder="+1234567890"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
            {saved && (
              <span className="text-green-600 font-medium">✓ Settings saved successfully!</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
