# Troubleshooting Guide

## Common Issues and Solutions

### 🚫 "Message body is required" Error

**Symptoms:**
- Messages show as "Failed" in history
- Error: "Message body is required"
- Provider: OpenRouter, Groq, or others

**Cause:**
The AI model is returning an empty response or the API call is failing silently.

**Solutions:**

#### 1. Check Browser Console (F12)
Open DevTools (press F12) and look at the Console tab for detailed error messages:
- Look for API response logs (e.g., "OpenRouter response:")
- Check for error messages before "Message body is required"

#### 2. Model Name Issues
The most common cause is an incorrect or unavailable model name.

**For OpenRouter:**
- ❌ BAD: `openai/gpt-oss-20b:free` (might be unavailable or have rate limits)
- ✅ GOOD: `google/gemini-flash-1.5` (free tier, reliable)
- ✅ GOOD: `meta-llama/llama-3-8b-instruct:free`
- ✅ GOOD: `mistralai/mistral-7b-instruct:free`

Check available models at: https://openrouter.ai/models

**For Groq:**
- ✅ `llama3-8b-8192`
- ✅ `llama3-70b-8192`
- ✅ `mixtral-8x7b-32768`
- ✅ `gemma-7b-it`

**For OpenAI:**
- ✅ `gpt-4o`
- ✅ `gpt-4o-mini`
- ✅ `gpt-3.5-turbo`

**For Anthropic:**
- ✅ `claude-3-5-sonnet-20241022`
- ✅ `claude-3-opus-20240229`
- ✅ `claude-3-haiku-20240307`

#### 3. API Key Issues
- Verify your API key is correct in Settings
- For OpenRouter: Make sure you have credits (check https://openrouter.ai/credits)
- For paid APIs: Ensure your account has sufficient balance

#### 4. Rate Limits
Free tier models often have strict rate limits:
- **OpenRouter free models**: Very limited, may fail frequently
- **Solution**: Use a paid model or wait before retrying
- Check the model's specific limits on the provider's website

#### 5. Model Availability
Some models may be temporarily unavailable or deprecated:
- Try a different model from the same provider
- Check the provider's status page
- Use a more popular/stable model

### 🔍 Debugging Steps

1. **Open Browser DevTools** (F12)
   
2. **Go to Console tab**

3. **Try sending to ONE test number**

4. **Look for these log messages:**
   ```
   OpenRouter response: {...}
   ```
   
5. **Check the response structure:**
   - If you see the response, check if `choices[0].message.content` exists
   - If empty: The model failed to generate a response
   - If error: Read the error message for details

### 🎯 Recommended Free Models

#### Best for Testing (Free Tier)
**Groq** (Fast, generous free tier):
- `llama3-8b-8192` - Best all-around choice
- `mixtral-8x7b-32768` - For complex prompts

**OpenRouter** (Free tier available):
- `google/gemini-flash-1.5` - Fast and reliable
- `meta-llama/llama-3.1-8b-instruct:free` - Good quality
- `mistralai/mistral-7b-instruct:free` - Decent performance

#### Production Ready (Paid but Reliable)
- **OpenAI**: `gpt-4o-mini` - Best value
- **Anthropic**: `claude-3-haiku-20240307` - Fast and affordable
- **Groq**: `llama3-70b-8192` - Still free, higher quality

### 📱 Twilio Issues

#### "Authentication Error"
- Double-check Account SID and Auth Token in Settings
- Ensure no extra spaces in credentials
- Verify credentials at: https://console.twilio.com/

#### "From number not valid"
- Phone number must be in E.164 format: `+1234567890`
- Verify the number in your Twilio console
- Ensure it's SMS-capable

#### "To number is not a valid phone number"
- Must include country code: `+91` for India, `+1` for US/Canada
- No spaces or special characters
- Format: `+<country code><number>`

### 🌐 Network Issues

#### CORS Errors
If you see CORS errors in console:
- This is expected for direct API calls from browser
- Some providers may block browser requests
- **Solution**: The app should work despite CORS warnings; if not, you may need a backend proxy

#### Timeout Errors
- Check your internet connection
- Try a different model/provider
- The model server might be down (check provider status)

### 💾 Storage Issues

#### "localStorage is full"
- Clear message history (Message History → Clear History)
- Or manually clear: F12 → Application → Local Storage → Clear

#### Settings not saving
- Check if localStorage is enabled in your browser
- Try a different browser
- Check if you're in private/incognito mode (localStorage may be disabled)

### 🔧 Advanced Debugging

#### Enable Verbose Logging
Open browser console before starting a campaign to see:
- API request details
- Response structures  
- Exact error messages

#### Test Individual Components

**Test AI Generation Only:**
```javascript
// Paste in browser console (F12)
const config = {
  provider: 'groq',
  model: 'llama3-8b-8192',
  messagePrompt: 'Send a friendly hello message',
  persona: 'sales',
  documents: [],
  apiKeys: {
    groq: 'your-api-key-here'
  }
};

// Note: You'll need to import the function or test via the UI
```

**Test Twilio Only:**
```javascript
// In browser console after loading the app
const twilioConfig = {
  accountSid: 'AC...',
  authToken: 'your-token',
  phoneNumber: '+1234567890'
};

// Send a test SMS with a known message
```

### 📚 Getting Help

If you're still stuck:

1. **Check the console** (F12 → Console tab)
2. **Copy the exact error message**
3. **Note which model and provider you're using**
4. **Check provider status pages:**
   - Groq: https://status.groq.com/
   - OpenAI: https://status.openai.com/
   - Anthropic: https://status.anthropic.com/
   - OpenRouter: https://openrouter.ai/
   - Twilio: https://status.twilio.com/

### 🎓 Pro Tips

✅ **DO:**
- Start with Groq (generous free tier, very fast)
- Test with your own phone number first
- Check browser console for errors
- Use stable, popular models
- Keep message prompts clear and concise

❌ **DON'T:**
- Use deprecated or unstable models
- Send to many numbers without testing first
- Ignore console errors
- Use very long or complex prompts (for SMS)
- Forget to include country codes in phone numbers

---

**Still having issues?** The most common fix is switching to a different model. Try `llama3-8b-8192` on Groq first!
