# AI SMS Agent Web Application

A powerful web application that allows you to build, manage, and deploy AI-powered SMS campaigns. Connect to multiple AI providers (Groq, OpenAI, Ollama, Anthropic, OpenRouter) and send personalized SMS messages through Twilio.

## Features

✅ **Multiple AI Provider Support**
- Groq
- OpenAI
- Ollama (self-hosted)
- Anthropic
- OpenRouter

✅ **Agent Template Management**
- Create reusable agent templates
- Configure persona (Sales/Support)
- Upload knowledge base documents (.txt, .pdf)
- Edit and delete templates

✅ **Campaign Management**
- Launch campaigns from templates or create one-off campaigns
- Sequential SMS delivery
- Real-time campaign progress monitoring
- Multi-language support (English, Hindi, Arabic)

✅ **Message History**
- Complete message log with search functionality
- View sent/failed status
- Filter by phone number or content
- Campaign statistics

✅ **Local Storage**
- No database required
- All data stored in browser localStorage
- API keys stored securely in browser
- Complete privacy - no data leaves your device

## Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **API Keys** for at least one AI provider:
   - [Groq API Key](https://console.groq.com/)
   - [OpenAI API Key](https://platform.openai.com/api-keys)
   - [Anthropic API Key](https://console.anthropic.com/)
   - [OpenRouter API Key](https://openrouter.ai/)
   - Ollama (for self-hosted models)
3. **Twilio Account**:
   - [Sign up for Twilio](https://www.twilio.com/try-twilio)
   - Get your Account SID, Auth Token, and a Twilio Phone Number

## Installation

1. **Clone or download this repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - The application will automatically open at `http://localhost:3000`
   - Or manually navigate to the URL shown in your terminal

## Initial Setup

### 1. Configure API Keys

Navigate to **Settings** page and enter your API keys:

**AI Providers:**
- Enter at least one AI provider API key
- For Ollama, specify your base URL (default: `http://localhost:11434`)

**Twilio Configuration:**
- Account SID (starts with AC...)
- Auth Token
- Twilio Phone Number (format: +1234567890)

Click **Save Settings** to persist your configuration.

### 2. Create Your First Agent (Optional)

Navigate to **My Agents** page:

1. Click **Create New Agent**
2. Fill in the template details:
   - **Template Name**: Give it a memorable name
   - **AI Provider**: Select your configured provider
   - **Model Name**: Enter the exact model identifier
     - Groq: `llama3-8b-8192`, `mixtral-8x7b-32768`
     - OpenAI: `gpt-4o`, `gpt-3.5-turbo`
     - Anthropic: `claude-3-opus-20240229`, `claude-3-sonnet-20240229`
     - Ollama: `llama3`, `mistral`, etc.
   - **Persona**: Sales or Support
   - **Message Prompt**: Describe what the SMS should communicate
   - **Documents** (Optional): Upload .txt or .pdf files for knowledge base
3. Click **Save Template**

## Usage

### Launching a Campaign

1. Navigate to the **Home** page
2. Either:
   - Load a saved agent template from the dropdown, OR
   - Configure a new campaign from scratch
3. Fill in all required fields:
   - AI Provider & Model
   - Persona (Sales/Support)
   - Message Prompt
   - Language (English/Hindi/Arabic)
   - Phone Numbers (one per line, with country codes)
4. Click **Start Messaging Campaign**

### Monitoring Progress

- You'll be automatically redirected to the Campaign Progress page
- Watch real-time status updates for each phone number:
  - **Queued**: Waiting to be processed
  - **Processing**: AI generating message and sending
  - **Sent**: Successfully delivered
  - **Failed**: Error occurred (with error details)
- Progress bar shows overall completion
- Once complete, you'll be redirected to Message History

### Viewing Message History

Navigate to **Message History** page to:
- View all sent messages
- Search by phone number or message content
- See detailed information including:
  - Phone number
  - Timestamp
  - Status (Sent/Failed)
  - Message content
  - AI provider and model used
  - Error details (if failed)
- View campaign statistics
- Clear history if needed

## Important Notes

### SMS Character Limit
- SMS messages are limited to 160 characters
- The AI is instructed to keep messages concise
- Messages exceeding 160 characters may be split into multiple SMS by Twilio

### API Rate Limits
- The application sends messages sequentially to avoid rate limits
- There's a 1-second delay between each message
- Be aware of your API provider's rate limits

### Twilio Costs
- Twilio charges per SMS sent
- Check [Twilio Pricing](https://www.twilio.com/sms/pricing) for your region
- International SMS costs vary by country
- Failed messages may still incur charges

### Browser Compatibility
- Works best in modern browsers (Chrome, Firefox, Safari, Edge)
- Requires localStorage support
- JavaScript must be enabled

### Data Privacy
- All data stored locally in your browser
- API keys never sent to any third party (except the respective APIs)
- No telemetry or analytics
- Clear browser data to remove all information

## Knowledge Base Documents

When you upload documents:
- The AI receives instructions to base 90% of responses on these documents
- Supported formats: .txt, .pdf
- Documents are stored in browser localStorage
- Larger documents may impact performance

## Troubleshooting

### Messages Not Sending

1. **Check API Keys**: Verify all keys are correctly entered in Settings
2. **Verify Twilio Balance**: Ensure you have sufficient Twilio credits
3. **Phone Number Format**: Must include country code (e.g., +1234567890)
4. **Check Console**: Open browser DevTools (F12) and check Console for errors

### AI Generation Errors

1. **Model Name**: Ensure you're using the correct model identifier for your provider
2. **API Quota**: Check if you've exceeded your API quota
3. **Network Issues**: Verify internet connection

### Performance Issues

1. **Large Documents**: Try using smaller knowledge base documents
2. **Browser Storage**: Clear old message history if localStorage is full
3. **Many Recipients**: Consider splitting into smaller campaigns

## Development

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

### Project Structure

```
ai-sms-agent/
├── src/
│   ├── components/        # React components
│   │   ├── Home.jsx
│   │   ├── MyAgents.jsx
│   │   ├── AgentEditor.jsx
│   │   ├── MessageHistory.jsx
│   │   ├── SettingsPage.jsx
│   │   └── CampaignProgress.jsx
│   ├── utils/            # Utility functions
│   │   ├── storage.js
│   │   ├── aiProviders.js
│   │   ├── twilioSender.js
│   │   └── documentProcessor.js
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Security Considerations

⚠️ **Important Security Notes:**

1. **API Keys**: This is a client-side application. API keys are stored in localStorage and are accessible via browser DevTools. For production use, consider implementing a backend proxy.

2. **Twilio Credentials**: Exposing Twilio credentials in the browser is not recommended for production. Consider using a backend API to handle Twilio requests.

3. **Use Cases**: This application is designed for:
   - Personal use
   - Internal tools
   - Development/testing
   - Small-scale campaigns

4. **Not Recommended For**:
   - Public-facing production applications
   - Large-scale commercial use
   - Applications with sensitive data

## Support & Contributions

For issues, questions, or contributions, please refer to the project repository.

## License

This project is provided as-is for educational and personal use.

---

**Happy Messaging! 📱✨**
