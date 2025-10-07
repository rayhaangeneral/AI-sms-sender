import { supabase } from '../lib/supabase';

// Local Storage Keys (fallback)
const KEYS = {
  API_KEYS: 'ai_sms_api_keys',
  AGENTS: 'ai_sms_agents',
  MESSAGE_HISTORY: 'ai_sms_message_history',
};

// Get current user ID
const getUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id;
};

// API Keys Management
export const saveApiKeys = async (apiKeys) => {
  const userId = await getUserId();
  
  if (userId) {
    // Save to Supabase
    const { error } = await supabase
      .from('user_api_keys')
      .upsert({
        user_id: userId,
        api_keys: apiKeys,
        updated_at: new Date().toISOString(),
      });
    
    if (error) {
      console.error('Error saving API keys to Supabase:', error);
      // Fallback to localStorage
      localStorage.setItem(KEYS.API_KEYS, JSON.stringify(apiKeys));
    }
  } else {
    // Not logged in, use localStorage
    localStorage.setItem(KEYS.API_KEYS, JSON.stringify(apiKeys));
  }
};

export const getApiKeys = async () => {
  const userId = await getUserId();
  
  if (userId) {
    // Get from Supabase
    const { data, error } = await supabase
      .from('user_api_keys')
      .select('api_keys')
      .eq('user_id', userId)
      .single();
    
    if (!error && data) {
      return data.api_keys;
    }
    
    // If error is "no rows", return empty defaults (new user)
    // Do NOT fall back to localStorage when logged in - prevents key sharing
    if (error && error.code === 'PGRST116') {
      // No data found - new user, return empty defaults
      return {
        groq: '',
        openai: '',
        ollama: { apiKey: '', baseUrl: 'http://localhost:11434' },
        anthropic: '',
        openrouter: '',
        twilio: { accountSid: '', authToken: '', phoneNumber: '' }
      };
    }
    
    // Other Supabase error - log it but return empty defaults
    console.error('Error loading API keys from Supabase:', error);
    return {
      groq: '',
      openai: '',
      ollama: { apiKey: '', baseUrl: 'http://localhost:11434' },
      anthropic: '',
      openrouter: '',
      twilio: { accountSid: '', authToken: '', phoneNumber: '' }
    };
  }
  
  // Only use localStorage if NOT logged in
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
export const saveAgent = async (agent) => {
  const userId = await getUserId();
  
  if (userId) {
    // Save to Supabase
    if (!agent.id) {
      agent.id = Date.now().toString();
      agent.createdAt = new Date().toISOString();
    }
    
    const { error } = await supabase
      .from('agents')
      .upsert({
        id: agent.id,
        user_id: userId,
        name: agent.name,
        provider: agent.provider,
        model: agent.model,
        message_prompt: agent.messagePrompt,
        persona: agent.persona,
        documents: agent.documents || [],
        created_at: agent.createdAt,
        updated_at: new Date().toISOString(),
      });
    
    if (error) {
      console.error('Error saving agent to Supabase:', error);
      throw new Error(`Failed to save agent: ${error.message}`);
    }
    
    console.log('Agent saved successfully to Supabase:', agent.id);
    return agent;
  } else {
    // LocalStorage fallback
    const agents = await getAgents();
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
  }
};

export const getAgents = async () => {
  const userId = await getUserId();
  
  if (userId) {
    // Get from Supabase
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      console.log('Loaded agents from Supabase:', data.length);
      return data.map(agent => ({
        id: agent.id,
        name: agent.name,
        provider: agent.provider,
        model: agent.model,
        messagePrompt: agent.message_prompt,
        persona: agent.persona,
        documents: agent.documents || [],
        createdAt: agent.created_at,
      }));
    }
    
    // If logged in but got error, return empty array
    // Do NOT fall back to localStorage when logged in - prevents data sharing
    console.log('No agents found in Supabase or error:', error);
    return [];
  }
  
  // Only use localStorage if NOT logged in
  const agents = localStorage.getItem(KEYS.AGENTS);
  return agents ? JSON.parse(agents) : [];
};

export const deleteAgent = async (agentId) => {
  const userId = await getUserId();
  
  if (userId) {
    // Delete from Supabase
    const { error } = await supabase
      .from('agents')
      .delete()
      .eq('id', agentId)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error deleting agent from Supabase:', error);
      throw error;
    }
  } else {
    // Only modify localStorage if NOT logged in
    const agents = await getAgents();
    const filtered = agents.filter(a => a.id !== agentId);
    localStorage.setItem(KEYS.AGENTS, JSON.stringify(filtered));
  }
};

export const getAgentById = async (agentId) => {
  const agents = await getAgents();
  return agents.find(a => a.id === agentId);
};

// Message History Management
export const saveMessage = async (message) => {
  const userId = await getUserId();
  
  message.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
  message.timestamp = new Date().toISOString();
  
  if (userId) {
    // Save to Supabase
    const { error } = await supabase
      .from('message_history')
      .insert({
        id: message.id,
        user_id: userId,
        phone_number: message.phoneNumber,
        message: message.message,
        status: message.status,
        error: message.error,
        provider: message.provider,
        model: message.model,
        language: message.language,
        timestamp: message.timestamp,
      });
    
    if (error) {
      console.error('Error saving message to Supabase:', error);
      // Fallback to localStorage
      const history = await getMessageHistory();
      history.unshift(message);
      localStorage.setItem(KEYS.MESSAGE_HISTORY, JSON.stringify(history));
    }
  } else {
    // LocalStorage fallback
    const history = await getMessageHistory();
    history.unshift(message);
    localStorage.setItem(KEYS.MESSAGE_HISTORY, JSON.stringify(history));
  }
  
  return message;
};

export const getMessageHistory = async () => {
  const userId = await getUserId();
  
  if (userId) {
    // Get from Supabase
    const { data, error } = await supabase
      .from('message_history')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
    
    if (!error && data) {
      return data.map(msg => ({
        id: msg.id,
        phoneNumber: msg.phone_number,
        message: msg.message,
        status: msg.status,
        error: msg.error,
        provider: msg.provider,
        model: msg.model,
        language: msg.language,
        timestamp: msg.timestamp,
      }));
    }
    
    console.error('Error loading message history from Supabase:', error);
  }
  
  // Fallback to localStorage
  const history = localStorage.getItem(KEYS.MESSAGE_HISTORY);
  return history ? JSON.parse(history) : [];
};

export const clearMessageHistory = async () => {
  const userId = await getUserId();
  
  if (userId) {
    // Clear from Supabase
    const { error } = await supabase
      .from('message_history')
      .delete()
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error clearing message history from Supabase:', error);
    }
  }
  
  // Also clear localStorage
  localStorage.setItem(KEYS.MESSAGE_HISTORY, JSON.stringify([]));
};
