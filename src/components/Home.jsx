import { useState, useEffect } from 'react';
import { Send, Upload, Trash2, AlertCircle } from 'lucide-react';
import { getAgents, getAgentById, getApiKeys } from '../utils/storage';
import { processDocuments, validateFileType } from '../utils/documentProcessor';

function Home({ onStartCampaign }) {
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [formData, setFormData] = useState({
    provider: 'groq',
    model: '',
    messagePrompt: '',
    persona: 'sales',
    documents: [],
    language: 'english',
    phoneNumbers: ''
  });

  useEffect(() => {
    const loadAgents = async () => {
      console.log('🔄 Loading agents...');
      const agentsList = await getAgents();
      console.log('✅ Agents loaded:', agentsList.length, 'agents found');
      console.log('📋 Agent list:', agentsList);
      setAgents(agentsList);
    };
    loadAgents();
  }, []);

  const handleLoadAgent = async (agentId) => {
    setSelectedAgentId(agentId);
    console.log('Loading agent:', agentId);
    
    if (!agentId) {
      setFormData({
        provider: 'groq',
        model: '',
        messagePrompt: '',
        persona: 'sales',
        documents: [],
        language: formData.language,
        phoneNumbers: formData.phoneNumbers
      });
      return;
    }

    const agent = await getAgentById(agentId);
    console.log('Agent loaded:', agent);
    
    if (agent) {
      const newFormData = {
        provider: agent.provider,
        model: agent.model,
        messagePrompt: agent.messagePrompt,
        persona: agent.persona,
        documents: agent.documents || [],
        language: formData.language,
        phoneNumbers: formData.phoneNumbers
      };
      console.log('Setting form data:', newFormData);
      setFormData(newFormData);
    } else {
      console.error('Agent not found:', agentId);
      alert('Could not load agent. Please try again.');
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(validateFileType);
    
    if (validFiles.length !== files.length) {
      alert('Some files were skipped. Only .txt and .pdf files are allowed.');
    }

    const processedDocs = await processDocuments(validFiles);
    setFormData({
      ...formData,
      documents: [...formData.documents, ...processedDocs]
    });
  };

  const removeDocument = (index) => {
    const newDocs = formData.documents.filter((_, i) => i !== index);
    setFormData({ ...formData, documents: newDocs });
  };

  const handleStartCampaign = async () => {
    // Validate required fields
    if (!formData.model || !formData.messagePrompt || !formData.phoneNumbers.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate API keys
    const apiKeys = await getApiKeys();
    const providerKey = formData.provider === 'ollama' 
      ? apiKeys.ollama.baseUrl 
      : apiKeys[formData.provider];
    
    if (!providerKey) {
      alert(`Please configure your ${formData.provider} API key in Settings`);
      return;
    }

    if (!apiKeys.twilio.accountSid || !apiKeys.twilio.authToken || !apiKeys.twilio.phoneNumber) {
      alert('Please configure your Twilio credentials in Settings');
      return;
    }

    // Parse phone numbers
    const phoneNumbers = formData.phoneNumbers
      .split('\n')
      .map(num => num.trim())
      .filter(num => num.length > 0);

    if (phoneNumbers.length === 0) {
      alert('Please enter at least one phone number');
      return;
    }

    // Create campaign data
    const campaignData = {
      ...formData,
      phoneNumbers,
      apiKeys
    };

    onStartCampaign(campaignData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Send className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-gray-900">Launch SMS Campaign</h2>
        </div>

        <div className="space-y-6">
          {/* Load from Template */}
          {agents.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Load from Saved Template (Optional)
              </label>
              <select
                value={selectedAgentId}
                onChange={(e) => handleLoadAgent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
              >
                <option value="">-- Start from scratch --</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* AI Provider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Provider <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.provider}
              onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="groq">Groq</option>
              <option value="openai">OpenAI</option>
              <option value="ollama">Ollama</option>
              <option value="anthropic">Anthropic</option>
              <option value="openrouter">OpenRouter</option>
            </select>
          </div>

          {/* Model Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              placeholder="e.g., llama3-8b-8192, gpt-4o, claude-3-opus"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* Persona */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Persona <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.persona}
              onChange={(e) => setFormData({ ...formData, persona: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="sales">Sales</option>
              <option value="support">Support</option>
            </select>
          </div>

          {/* Message Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Prompt <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.messagePrompt}
              onChange={(e) => setFormData({ ...formData, messagePrompt: e.target.value })}
              placeholder="Describe what the SMS should communicate..."
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Knowledge Base Documents (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <label className="cursor-pointer">
                <span className="text-primary hover:text-primary/80 font-medium">
                  Click to upload
                </span>
                <span className="text-gray-600"> or drag and drop</span>
                <input
                  type="file"
                  multiple
                  accept=".txt,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-500 mt-1">.txt or .pdf files</p>
            </div>

            {formData.documents && formData.documents.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">
                        {(doc.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="arabic">Arabic</option>
            </select>
          </div>

          {/* Phone Numbers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Numbers <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.phoneNumbers}
              onChange={(e) => setFormData({ ...formData, phoneNumbers: e.target.value })}
              placeholder="+1234567890&#10;+9876543210&#10;+1122334455"
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter one phone number per line (include country code)
            </p>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Before starting:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Ensure your API keys are configured in Settings</li>
                <li>Verify all phone numbers include country codes</li>
                <li>Messages will be sent sequentially</li>
              </ul>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartCampaign}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-lg"
          >
            <Send className="w-5 h-5" />
            Start Messaging Campaign
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
