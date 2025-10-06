// Local Storage Keys
const KEYS = {
  API_KEYS: 'ai_sms_api_keys',
  AGENTS: 'ai_sms_agents',
  MESSAGE_HISTORY: 'ai_sms_message_history',
};

// API Keys Management
export const saveApiKeys = (apiKeys) => {
  localStorage.setItem(KEYS.API_KEYS, JSON.stringify(apiKeys));
};

export const getApiKeys = () => {
  const keys = localStorage.getItem(KEYS.API_KEYS);
  return keys ? JSON.parse(keys) : {
    groq: '',
    openai: '',
    ollama: { apiKey: '', baseUrl: 'http://localhost:11434' },
    anthropic: '',
    openrouter: '',
    twilio: { accountSid: '', authToken: '', phoneNumber: '' }
  };
};

// Agent Templates Management
export const saveAgent = (agent) => {
  const agents = getAgents();
  const existingIndex = agents.findIndex(a => a.id === agent.id);
  
  if (existingIndex >= 0) {
    agents[existingIndex] = agent;
  } else {
    agent.id = Date.now().toString();
    agent.createdAt = new Date().toISOString();
    agents.push(agent);
  }
  
  localStorage.setItem(KEYS.AGENTS, JSON.stringify(agents));
  return agent;
};

export const getAgents = () => {
  const agents = localStorage.getItem(KEYS.AGENTS);
  return agents ? JSON.parse(agents) : [];
};

export const deleteAgent = (agentId) => {
  const agents = getAgents().filter(a => a.id !== agentId);
  localStorage.setItem(KEYS.AGENTS, JSON.stringify(agents));
};

export const getAgentById = (agentId) => {
  return getAgents().find(a => a.id === agentId);
};

// Message History Management
export const saveMessage = (message) => {
  const history = getMessageHistory();
  message.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
  message.timestamp = new Date().toISOString();
  history.unshift(message);
  localStorage.setItem(KEYS.MESSAGE_HISTORY, JSON.stringify(history));
  return message;
};

export const getMessageHistory = () => {
  const history = localStorage.getItem(KEYS.MESSAGE_HISTORY);
  return history ? JSON.parse(history) : [];
};

export const clearMessageHistory = () => {
  localStorage.setItem(KEYS.MESSAGE_HISTORY, JSON.stringify([]));
};
