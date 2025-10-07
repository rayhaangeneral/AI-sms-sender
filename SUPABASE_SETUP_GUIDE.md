# Supabase Setup Guide

This guide will help you set up Supabase authentication and database for the AI SMS Agent.

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in the details:
   - **Name**: AI SMS Agent
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your location
5. Click **"Create new project"**
6. Wait for the project to be created (~2 minutes)

## 2. Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** (gear icon)
2. Click **API** in the left sidebar
3. You'll need two values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
4. Keep these handy for the next step

## 3. Configure Environment Variables

1. In your project root, create a file named `.env`
2. Add the following (replace with your actual values):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

⚠️ **Important**: Never commit the `.env` file to git!

## 4. Set Up Database Tables

1. In your Supabase dashboard, go to **SQL Editor** (database icon with lightning bolt)
2. Click **"New Query"**
3. Copy the entire content from `SUPABASE_SETUP.sql` file
4. Paste it into the SQL editor
5. Click **"Run"** or press `Ctrl+Enter`
6. You should see success messages for all commands

### Verify Tables Created

1. Go to **Table Editor** in the left sidebar
2. You should see these tables:
   - `user_api_keys`
   - `agents`
   - `message_history`

## 5. Configure Email Authentication (Optional)

By default, Supabase requires email confirmation. For testing, you can disable this:

1. Go to **Authentication** → **Providers**
2. Click on **Email** provider
3. Under **"Email Verification"**:
   - Toggle **OFF** "Confirm email" (for testing only)
   - Or configure your email settings for production
4. Click **Save**

For production, it's recommended to keep email verification ON and configure SMTP.

## 6. Test Your Setup

1. Install dependencies (if not already done):
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. You should see the Login/Signup page
4. Try creating an account:
   - Enter your email
   - Create a password (min 6 characters)
   - Click Sign Up
   - You should be redirected to login
   - Log in with your credentials

## 7. Verify Database Integration

After logging in:

1. **Test API Keys Storage**:
   - Go to Settings page
   - Add some API keys
   - Click Save
   - Refresh the page
   - Your keys should still be there (loaded from Supabase)

2. **Test Agents**:
   - Go to My Agents
   - Create a new agent template
   - Save it
   - Refresh the page
   - Your agent should still be there

3. **Check Supabase Dashboard**:
   - Go to **Table Editor** in Supabase
   - Click on `user_api_keys` table
   - You should see your data there

## Common Issues & Solutions

### Issue: "Missing Supabase environment variables"

**Solution**: Make sure you created the `.env` file with the correct variable names:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Issue: "Failed to create account" or "Invalid credentials"

**Possible causes**:
1. Email already exists (try a different email)
2. Password too short (min 6 characters)
3. Email verification is ON but you haven't confirmed email
   - Check your email inbox
   - Or disable email verification (see step 5)

### Issue: Data not saving to Supabase

**Check**:
1. Are you logged in? (Check if user email appears in header)
2. Check browser console (F12) for errors
3. Verify tables were created correctly
4. Check RLS policies are enabled

### Issue: "Permission denied" errors

**Solution**: Make sure Row Level Security policies are correctly set up:
- Run the `SUPABASE_SETUP.sql` script again
- Check in Supabase **Authentication** → **Policies**
- Each table should have SELECT, INSERT, UPDATE, DELETE policies

## Security Notes

### For Testing:
- API keys are stored in plain text in Supabase (as per requirements)
- Email verification can be disabled
- LocalStorage fallback is available

### For Production:
- Enable email verification
- Consider encrypting sensitive API keys
- Enable SMTP for email sending
- Set up proper backup strategies
- Monitor usage in Supabase dashboard

## Database Schema

### user_api_keys
- `user_id` (UUID, Primary Key) - References auth.users
- `api_keys` (JSONB) - Stores all API keys
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

### agents
- `id` (TEXT, Primary Key)
- `user_id` (UUID) - References auth.users
- `name` (TEXT) - Agent template name
- `provider` (TEXT) - AI provider
- `model` (TEXT) - Model name
- `message_prompt` (TEXT) - Message instructions
- `persona` (TEXT) - Sales or Support
- `documents` (JSONB) - Uploaded documents
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### message_history
- `id` (TEXT, Primary Key)
- `user_id` (UUID) - References auth.users
- `phone_number` (TEXT) - Recipient phone
- `message` (TEXT) - SMS content
- `status` (TEXT) - sent/failed
- `error` (TEXT) - Error message if failed
- `provider` (TEXT) - AI provider used
- `model` (TEXT) - Model used
- `language` (TEXT) - Message language
- `timestamp` (TIMESTAMPTZ)

## Backup and Export

### Export Data
Go to **Table Editor** → Select table → **Export** → Choose format (CSV, JSON)

### Backup Database
Supabase provides automatic backups. Check **Settings** → **Database** → **Backups**

## Next Steps

Once setup is complete:
1. Create your first agent template
2. Configure your AI provider keys (Groq, OpenAI, etc.)
3. Add Twilio credentials
4. Send a test campaign!

## Support

If you encounter issues:
1. Check the browser console (F12)
2. Check Supabase logs (Dashboard → Logs)
3. Verify all environment variables are set
4. Make sure tables and policies are created

---

**You're all set! Your AI SMS Agent is now using Supabase for authentication and data storage.** 🚀
