# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Copy your project URL and anon key
3. Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
```

### Step 3: Setup Database

1. Open Supabase Dashboard → SQL Editor
2. Copy the entire contents of `supabase/migrations/20250101000000_create_diffs_table.sql`
3. Paste into SQL Editor and click "Run"

This creates:
- `diffs` table for storing comparisons
- Row Level Security policies
- Auto-generated share tokens
- Indexes for performance

### Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ✅ Verify Installation

1. Go to [http://localhost:3000/differ](http://localhost:3000/differ)
2. You should see the JSON Differ with sample data
3. Try clicking "Show Diff" to see the comparison view
4. Try "Format Original" to test Prettier integration

---

## 🎯 Test Features

### Test Privacy Mode
1. Privacy mode is ON by default (green banner)
2. Share button should be disabled
3. Click "Privacy Mode ON" to toggle OFF
4. Share button becomes enabled

### Test Sharing (Requires Supabase)
1. Turn OFF privacy mode
2. Click "Share" button
3. Add a title and click "Share"
4. You should get a shareable URL
5. Open URL in new tab to verify

### Test History (Requires Auth)
1. Click "History" tab
2. If not logged in, you'll see "Sign in to view history"
3. Go to `/auth/login` to create account
4. After login, saved diffs appear in History

### Test Export
1. Click "Export" dropdown
2. Try "Export as HTML" - downloads styled HTML file
3. Try "Export as Markdown" - downloads .md file
4. Open the files to verify formatting

---

## 🔧 Troubleshooting

### Issue: "Supabase client error"
**Solution:** Check `.env.local` has correct URL and key

### Issue: "Migration failed"
**Solution:** Make sure you're using the SQL Editor, not the Table Editor

### Issue: "Monaco editor not loading"
**Solution:** Clear browser cache and refresh

### Issue: "Share button not working"
**Solution:** Ensure privacy mode is OFF and JSON is valid

---

## 📁 Project Structure

```
differ/
├── app/
│   ├── page.tsx              # Landing page
│   └── differ/
│       ├── page.tsx          # Main tool (ALL FEATURES HERE)
│       └── [token]/page.tsx  # Shared diff viewer
├── components/
│   ├── json-diff-editor.tsx  # Monaco editor
│   ├── share-dialog.tsx      # Share modal
│   └── user-history.tsx      # History tab
├── lib/
│   ├── json-utils.ts         # Validation & formatting
│   ├── export-utils.ts       # HTML/MD/Text export
│   └── diff-service.ts       # Supabase operations
└── supabase/
    └── migrations/           # Database schema
```

---

## 🎨 All Features Location

Everything is on **ONE PAGE**: `/app/differ/page.tsx`

### Tabs
- **Compare Tab** - Main diff interface
- **History Tab** - Saved diffs

### Features in Compare Tab
- ✅ Dual editor (Original | Modified)
- ✅ Real-time validation
- ✅ Format/Prettify buttons
- ✅ Show Diff toggle
- ✅ Privacy mode toggle
- ✅ Advanced options (ignore order, keys)
- ✅ Export dropdown (JSON, HTML, MD, Text)
- ✅ Share button
- ✅ Copy & Clear buttons

---

## 🚢 Deploy to Production

### Option 1: Vercel (Recommended)

```bash
vercel
```

Add environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### Option 2: Any Node.js Host

```bash
npm run build
npm start
```

---

## 📊 Expected User Flow

1. **Land on homepage** → See features → Click "Start Comparing"
2. **Differ page** → Paste JSON → Click "Show Diff"
3. **See differences** → Click "Export" → Download HTML
4. **Want to share** → Turn off privacy → Click "Share" → Get URL
5. **Return later** → Click "History" tab → Load previous diff

---

## 🎯 Next Steps

1. ✅ Set up Google Analytics
2. ✅ Add meta tags for SEO
3. ✅ Submit to Product Hunt
4. ✅ Write blog posts
5. ✅ Share on Reddit (r/webdev, r/javascript)

---

**That's it! Your JSON Differ tool is ready to use. 🎉**
