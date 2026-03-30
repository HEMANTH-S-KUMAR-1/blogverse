# BlogVerse 🌐

A free community blogging platform where anyone can write, share, and earn — no account needed.

## Features

- ✍️ **Write Posts** — Rich text editor with TipTap, support for images, headings, lists, and more
- 👤 **Identity Modes** — Post anonymously, with a pseudonym, or publicly
- 🔑 **Edit Keys** — Secure edit keys to modify posts without user accounts
- 🎯 **6 Categories** — Health, AI & Tech, Finance, Student Life, Business, Eco Living
- 💚 **Reactions** — 5 emoji reactions per post (one per reader)
- 💬 **Comments** — Nested comment threads with replies
- 📱 **Share** — WhatsApp, Twitter, and copy link
- 🌙 **Dark Mode** — System-aware with manual toggle
- 💰 **Monetization** — AdSense, affiliates, UPI tips, Ko-fi, paid jobs, products, courses, sponsorships

## Tech Stack

- **Next.js 15** (App Router)
- **Tailwind CSS v4**
- **Supabase** (PostgreSQL + Row Level Security)
- **TipTap** (Rich Text Editor)
- **next-themes** (Dark Mode)
- **Formspree** (Contact Forms)
- **react-hot-toast** (Notifications)

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/HEMANTH-S-KUMAR-1/blogverse.git
cd blogverse
npm install
```

### 2. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free project
2. Note your **Project URL** and **Anon Key** from Settings > API

### 3. Configure Environment Variables

Copy `.env.local.example` or create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_PASSWORD=blogverse_admin_2024
NEXT_PUBLIC_UPI_ID=your_upi_id_here
NEXT_PUBLIC_KOFI_USERNAME=your_kofi_username
NEXT_PUBLIC_FORMSPREE_ID=your_formspree_form_id
```

### 4. Set Up Database

The database schema has already been applied via Supabase migrations. If you need to set it up manually, run the SQL from the `supabase/migrations` folder in your Supabase SQL editor.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### 6. Deploy to Vercel (Free)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **New Project** and import your `blogverse` repository
3. Add all environment variables from `.env.local`
4. Click **Deploy**

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Homepage | `/` | Featured post, category filters, posts grid, sidebar |
| Write | `/write` | Rich text editor with identity modes |
| Single Post | `/post/[slug]` | Full reading experience with reactions & comments |
| Edit Post | `/edit/[slug]` | Edit key verification + editor |
| Category | `/category/[name]` | Category-filtered posts |
| Writer | `/writer/[username]` | Writer profile with all posts |
| Jobs | `/jobs` | Job listings board |
| Products | `/products` | Digital downloads marketplace |
| Courses | `/courses` | Webinars and workshops |
| Advertise | `/advertise` | Sponsorship packages |
| Support | `/support` | UPI & Ko-fi donations |
| Admin | `/admin/add-job` | Password-protected job management |

## Monetization

| Stream | Description |
|--------|-------------|
| Google AdSense | Placeholder ad slots ready for real code |
| Affiliate Links | 6 category-matched affiliate banners |
| UPI Tips | Readers can tip writers via UPI |
| Ko-fi | Alternative tipping via Ko-fi |
| Job Listings | ₹199 per listing via UPI |
| Digital Products | Gumroad product links |
| Webinars | Paid registrations via Google Forms |
| Sponsorships | ₹500–₹3,000 packages |
| Newsletter | ₹1,000 per sponsored issue |

## License

MIT
