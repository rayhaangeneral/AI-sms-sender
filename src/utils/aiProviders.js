// AI Provider API integrations

const buildSystemPrompt = (persona, documents, messagePrompt) => {
  const personaInstructions = {
    sales: "You are a professional sales representative. Be persuasive, friendly, and focus on value proposition.",
    support: "You are a helpful customer support agent. Be empathetic, clear, and solution-oriented."
  };

  let systemPrompt = `${personaInstructions[persona.toLowerCase()] || personaInstructions.sales}\n\n`;
  systemPrompt += `${messagePrompt}\n\n`;
  
  if (documents && documents.length > 0) {
    systemPrompt += `IMPORTANT: You must base 90% of your responses on the following knowledge base documents:\n\n`;
    documents.forEach((doc, index) => {
      systemPrompt += `Document ${index + 1}: ${doc.name}\n${doc.content}\n\n`;
    });
  }
  
  systemPrompt += `\nGenerate a concise SMS message (160 characters or less). Be direct and actionable.`;
  
  return systemPrompt;
};

export const generateMessage = async (config, phoneNumber, language) => {
  const { provider, model, messagePrompt, persona, documents, apiKeys } = config;
  
  const systemPrompt = buildSystemPrompt(persona, documents, messagePrompt);
  const userPrompt = `Generate an SMS message for phone number ${phoneNumber} in ${language}.`;
  
  switch (provider.toLowerCase()) {
    case 'groq':
      return await callGroq(apiKeys.groq, model, systemPrompt, userPrompt);
    case 'openai':
      return await callOpenAI(apiKeys.openai, model, systemPrompt, userPrompt);
    case 'ollama':
      return await callOllama(apiKeys.ollama, model, systemPrompt, userPrompt);
    case 'anthropic':
      return await callAnthropic(apiKeys.anthropic, model, systemPrompt, userPrompt);
    case 'openrouter':
      return await callOpenRouter(apiKeys.openrouter, model, systemPrompt, userPrompt);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
};

// Groq API
const callGroq = async (apiKey, model, systemPrompt, userPrompt) => {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 200
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Groq API error:', errorData);
    throw new Error(`Groq API error: ${errorData.error?.message || response.statusText}`);
  }
  
  const data = await response.json();
  console.log('Groq response:', data);
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
    throw new Error('Groq returned empty response');
  }
  
  const content = data.choices[0].message.content.trim();
  if (!content) {
    throw new Error('AI generated empty message');
  }
  
  return content;
};

// OpenAI API
const callOpenAI = async (apiKey, model, systemPrompt, userPrompt) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 200
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('OpenAI API error:', errorData);
    throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
  }
  
  const data = await response.json();
  console.log('OpenAI response:', data);
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
    throw new Error('OpenAI returned empty response');
  }
  
  const content = data.choices[0].message.content.trim();
  if (!content) {
    throw new Error('AI generated empty message');
  }
  
  return content;
};

// Ollama API
const callOllama = async (ollamaConfig, model, systemPrompt, userPrompt) => {
  const baseUrl = ollamaConfig.baseUrl || 'http://localhost:11434';
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      stream: false
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Ollama API error:', errorData);
    throw new Error(`Ollama API error: ${errorData.error || response.statusText}`);
  }
  
  const data = await response.json();
  console.log('Ollama response:', data);
  
  if (!data.message || !data.message.content) {
    throw new Error('Ollama returned empty response');
  }
  
  const content = data.message.content.trim();
  if (!content) {
    throw new Error('AI generated empty message');
  }
  
  return content;
};

// Anthropic API
const callAnthropic = async (apiKey, model, systemPrompt, userPrompt) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: model,
      max_tokens: 200,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ]
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Anthropic API error:', errorData);
    throw new Error(`Anthropic API error: ${errorData.error?.message || response.statusText}`);
  }
  
  const data = await response.json();
  console.log('Anthropic response:', data);
  
  if (!data.content || !data.content[0] || !data.content[0].text) {
    throw new Error('Anthropic returned empty response');
  }
  
  const content = data.content[0].text.trim();
  if (!content) {
    throw new Error('AI generated empty message');
  }
  
  return content;
};

// OpenRouter API
const callOpenRouter = async (apiKey, model, systemPrompt, userPrompt) => {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'AI SMS Agent'
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 200
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('OpenRouter API error:', errorData);
    
    // Check for rate limit errors
    if (errorData.error?.code === 'rate_limit_exceeded' || 
        (errorData.error?.message && errorData.error.message.includes('rate limit'))) {
      throw new Error('OpenRouter rate limit exceeded. Try a different model or upgrade to Pro.');
    }
    
    throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`);
  }
  
  const data = await response.json();
  console.log('OpenRouter response:', data);
  
  // Check for rate limit in successful response
  if (data.error) {
    console.error('OpenRouter error in response:', data.error);
    if (data.error.message && data.error.message.includes('rate limit')) {
      throw new Error('OpenRouter rate limit exceeded. Try a different model or upgrade to Pro.');
    }
    throw new Error(`OpenRouter error: ${data.error.message}`);
  }
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
    console.error('Empty response data:', data);
    throw new Error('OpenRouter returned empty response. Model may be unavailable or rate limited.');
  }
  
  const content = data.choices[0].message.content.trim();
  if (!content) {
    throw new Error('AI generated empty message');
  }
  
  return content;
};
