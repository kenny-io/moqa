# Moqa

A powerful webhook creation, testing and debugging service built with Next.js and Supabase.

![Webhook Mock Screenshot](https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&q=80&w=1200&h=600)

## Features

- 🔗 Generate unique webhook URLs
- 🔄 Real-time request inspection
- ⚙️ Customizable responses
- 📝 Request history and logging
- 🔒 Private endpoints with authentication
- ⏱️ Response delay simulation
- 📊 Pretty-printed request data

## Tech Stack

- **Frontend**: Next.js 13 (App Router)
- **Backend**: Supabase
- **UI**: shadcn/ui + Tailwind CSS
- **Real-time**: Supabase Realtime
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

1. Node.js 18 or later
2. A Supabase account (free tier works great)
3. Git

### Step 1: Clone and Install

1. Clone the repository:
   ```bash
   git clone https://github.com/kenny-io/moqa.git
   cd moqa
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Step 2: Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. In your Supabase project:
   - Go to Settings > API
   - Copy the "Project URL" and "anon/public" key
   - Enable Email Auth in Authentication > Providers
   - Disable Email Confirmation (for development)

3. Run the database migrations:
   - Go to SQL Editor
   - Copy the contents of `supabase/migrations/20250102194523_divine_wind.sql`
   - Run the SQL script
   - Handle RLS policies as you see fit

### Step 3: Environment Setup

1. Create a `.env.local` file in the project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

   Replace `your_project_url` and `your_anon_key` with the values from Supabase.

### Step 4: Run the Project

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Sign up for a new account using email and password

### Step 5: Test Your Setup

1. Create a new webhook:
   - Click "New Webhook" in the dashboard
   - Give it a name
   - Choose whether it should be private

2. Test the webhook:
   ```bash
   # Replace {url} with your webhook URL
   curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"test": "Hello World"}' \
     http://localhost:3000/api/webhook/{url}
   ```

3. You should see the request appear in real-time in the dashboard

### Troubleshooting

1. **Database Connection Issues**
   - Verify your Supabase credentials
   - Check if the migrations ran successfully
   - Ensure RLS policies are in place

2. **Authentication Problems**
   - Confirm Email Auth is enabled in Supabase
   - Check if Email Confirmation is disabled
   - Clear browser cookies/localStorage if needed

3. **Real-time Updates Not Working**
   - Verify Supabase Realtime is enabled
   - Check browser console for WebSocket errors
   - Ensure you're authenticated