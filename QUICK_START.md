# Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Start the Development Server

If not already running, execute:
```bash
npm run dev
```

The application will open automatically at `http://localhost:3000`

### Step 2: Configure Your API Keys

1. Click on **Settings** in the navigation menu
2. Enter at least one AI provider API key:
   - **Groq**: Get from https://console.groq.com/
   - **OpenAI**: Get from https://platform.openai.com/api-keys
   - **Anthropic**: Get from https://console.anthropic.com/
   - **OpenRouter**: Get from https://openrouter.ai/
   - **Ollama**: Enter your base URL (default: http://localhost:11434)

3. Enter your Twilio credentials:
   - **Account SID** (starts with AC...)
   - **Auth Token**
   - **Phone Number** (format: +1234567890)
   
   Get these from: https://console.twilio.com/

4. Click **Save Settings**

### Step 3: Send Your First Campaign

#### Option A: Create an Agent Template First (Recommended)

1. Go to **My Agents**
2. Click **Create New Agent**
3. Fill in:
   - Template Name (e.g., "Sales Outreach")
   - AI Provider (select one you configured)
   - Model Name (e.g., `llama3-8b-8192` for Groq, `gpt-4o` for OpenAI)
   - Persona (Sales or Support)
   - Message Prompt (describe what the SMS should say)
   - Upload documents (optional)
4. Click **Save Template**

#### Option B: Create a One-Time Campaign

1. Go to **Home**
2. Fill in all fields directly
3. Enter phone numbers (one per line, with country code)
4. Click **Start Messaging Campaign**

## 📝 Recommended Model Names by Provider

### ⭐ Groq (BEST FOR GETTING STARTED - Fast & Free Tier)
- `llama3-8b-8192` - **RECOMMENDED** - Fast, reliable, generous free tier
- `llama3-70b-8192` - More capable, still fast
- `mixtral-8x7b-32768` - Great for complex prompts
- `gemma-7b-it` - Alternative option

### OpenAI (Paid - Most Reliable)
- `gpt-4o` - Latest and most capable
- `gpt-4o-mini` - **RECOMMENDED** - Faster and cheaper
- `gpt-3.5-turbo` - Budget-friendly option

### Anthropic (Paid - High Quality)
- `claude-3-5-sonnet-20241022` - Best overall
- `claude-3-haiku-20240307` - **RECOMMENDED** - Fastest and cheapest
- `claude-3-opus-20240229` - Most capable (expensive)

### Ollama (Self-hosted - Free but Requires Setup)
- `llama3` - General purpose
- `mistral` - Good performance
- `phi3` - Lightweight

### OpenRouter (Mixed - Free & Paid Models)
**Free Tier (May have rate limits):**
- `google/gemini-flash-1.5` - **RECOMMENDED FOR FREE** - Fast and reliable
- `meta-llama/llama-3.1-8b-instruct:free` - Decent quality
- `mistralai/mistral-7b-instruct:free` - Alternative

**Paid (More Reliable):**
- `anthropic/claude-3.5-sonnet`
- `openai/gpt-4o-mini`

⚠️ **NOTE:** Free models on OpenRouter often have strict rate limits and may return empty responses. For testing, use Groq instead!

## 💡 Pro Tips

1. **Start Small**: Test with 2-3 phone numbers first
2. **Character Limit**: Keep prompts concise (SMS = 160 chars)
3. **Rate Limits**: App sends 1 message per second to avoid limits
4. **Cost Awareness**: Check Twilio pricing for your region
5. **Test Mode**: Use your own phone number first

## 🎯 Example Campaign

**Persona**: Sales  
**Message Prompt**:
```
Send a friendly reminder about our Q4 sale ending this week. 
Mention 30% off all products and include a sense of urgency.
Keep it under 160 characters.
```

**Language**: English  
**Phone Numbers**:
```
+1234567890
+9876543210
```

## 📊 Monitoring & History

- **Campaign Progress**: Real-time updates during sending
- **Message History**: View all sent messages, search, and filter
- **Status Tracking**: See which messages succeeded or failed

## 🔧 Troubleshooting

**Issue**: Messages not sending
- ✅ Check API keys in Settings
- ✅ Verify Twilio credentials
- ✅ Check phone number format (+country code)
- ✅ Ensure Twilio account has credits

**Issue**: AI generation errors
- ✅ Verify model name is correct for provider
- ✅ Check API quota/limits
- ✅ Test internet connection

**Issue**: Browser errors
- ✅ Clear localStorage (F12 > Application > Local Storage)
- ✅ Hard refresh (Ctrl+Shift+R)
- ✅ Try different browser

## 🎨 Application Structure

```
┌─────────────────────────────────────┐
│  Home (Launch Campaigns)            │
│  - Load templates or create new     │
│  - Configure AI & messages          │
│  - Enter phone numbers              │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Campaign Progress                  │
│  - Real-time status updates         │
│  - Sent/Failed tracking             │
│  - Progress visualization           │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Message History                    │
│  - Search & filter messages         │
│  - View details & errors            │
│  - Campaign statistics              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  My Agents (Templates)              │
│  - Create reusable configs          │
│  - Edit & delete templates          │
│  - Knowledge base uploads           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Settings (API Keys)                │
│  - AI provider keys                 │
│  - Twilio credentials               │
│  - Stored in browser                │
└─────────────────────────────────────┘
```

---

**Need Help?** Check the full README.md for detailed documentation.
