# 🚀 Quick Setup Guide - AI SMS Agent v2.0

Get up and running in **10 minutes**!

---

## Step 1: Install Dependencies (1 min)

```bash
cd AI-sms-sender
npm install
```

---

## Step 2: Set Up Supabase (5 min)

### 2.1 Create Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click **"New Project"**
4. Fill in:
   - Name: `AI SMS Agent`
   - Password: (choose a strong one)
   - Region: (closest to you)
5. Wait ~2 minutes for project creation

### 2.2 Get Credentials
1. In Supabase dashboard → **Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://xxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### 2.3 Create .env File
Create file `.env` in project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 2.4 Set Up Database
1. In Supabase → **SQL Editor**
2. Click **"New Query"**
3. Open `SUPABASE_SETUP.sql` from project
4. Copy all content
5. Paste into SQL Editor
6. Click **"Run"**
7. ✅ Success! Tables created

---

## Step 3: Start the App (1 min)

```bash
npm run dev
```

App opens at: `http://localhost:3000`

---

## Step 4: Create Account (1 min)

1. You'll see the **Signup** page
2. Enter:
   - Email: your email
   - Password: min 6 characters
   - Confirm password
3. Click **Sign Up**
4. Click **Sign in** link
5. Log in with your credentials
6. ✅ You're in!

---

## Step 5: Configure API Keys (2 min)

### 5.1 Get Groq API Key (Recommended - Free)
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up
3. Go to **API Keys**
4. Click **"Create API Key"**
5. Copy the key (starts with `gsk_`)

### 5.2 Get Twilio Credentials
1. Go to [twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Sign up (free trial)
3. Copy:
   - **Account SID** (starts with `AC...`)
   - **Auth Token**
4. Get a phone number:
   - Dashboard → **Phone Numbers**
   - Buy a number (free with trial)
   - Copy the number (format: `+1234567890`)

### 5.3 Save in App
1. In your app, go to **Settings**
2. Paste:
   - Groq API Key
   - Twilio Account SID
   - Twilio Auth Token
   - Twilio Phone Number
3. Click **Save Settings**
4. ✅ Done!

---

## Step 6: Send Your First Message! (2 min)

1. Go to **Home** page
2. Fill in:
   - **AI Provider**: Groq
   - **Model Name**: `llama3-8b-8192`
   - **Persona**: Sales
   - **Message Prompt**: `Send a friendly greeting message`
   - **Language**: English
   - **Phone Numbers**: Your phone number (with country code, e.g., `+1234567890`)
3. Click **Start Messaging Campaign**
4. Watch the progress!
5. ✅ Check your phone for SMS!

---

## ✅ You're Done!

Your AI SMS Agent is ready. Now you can:
- Create agent templates
- Send campaigns
- View message history
- All data synced to cloud!

---

## 🆘 Quick Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env` file exists in project root
- Check variable names: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server: `npm run dev`

### "Failed to create account"
- Check password is at least 6 characters
- Try a different email
- Check Supabase is set up correctly

### "OpenRouter returned empty response"
- This is NOT Groq - switch to Groq
- Or use a different OpenRouter model

### "Message body is required"
- AI generated empty response
- Switch to Groq with `llama3-8b-8192`
- Check API key is valid

### Messages sending twice
- This is fixed in v2.0
- Make sure you're running latest code

---

## 📚 More Help

- **Complete setup**: See `README.md`
- **Supabase details**: See `SUPABASE_SETUP_GUIDE.md`
- **Debugging**: See `TROUBLESHOOTING.md`
- **AI providers**: See `PROVIDER_COMPARISON.md`
- **What changed**: See `CHANGELOG_V2.md`

---

## 🎯 Recommended Setup

**Best free tier combination:**
- **AI**: Groq with `llama3-8b-8192`
- **SMS**: Twilio (free trial)
- **Storage**: Supabase (free tier)

**Cost:** $0 for testing!

---

## 🚀 Next Steps

1. Create agent templates in **My Agents**
2. Try different AI models
3. Send campaigns to multiple numbers
4. Check **Message History** for results

**Happy messaging!** 📱✨
