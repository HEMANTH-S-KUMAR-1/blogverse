# BlogVerse — Complete Technical Documentation

> A free community blogging platform where anyone can write, share, and earn — no account required.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Environment Variables](#4-environment-variables)
5. [Database Schema](#5-database-schema)
6. [Application Routes (Pages)](#6-application-routes-pages)
7. [Server Actions (`app/actions.js`)](#7-server-actions-appactionsjs)
8. [API Routes](#8-api-routes)
9. [Components](#9-components)
10. [Library Modules (`lib/`)](#10-library-modules-lib)
11. [Security](#11-security)
12. [Monetization](#12-monetization)
13. [SEO & Metadata](#13-seo--metadata)
14. [Deployment](#14-deployment)
15. [Development](#15-development)

---

## 1. Project Overview

BlogVerse is a **Next.js 16** application that lets anyone publish blog posts without creating an account. Writers choose an identity mode (anonymous, pseudonym, or public) and receive a secret **edit key** after publishing, which they keep to edit or delete their post later.

Key characteristics:
- **No user authentication** — identity is managed by edit keys and identity modes.
- **6 content categories** — Health, AI & Tech, Finance, Student Life, Micro Business, Eco Living.
- **Multiple monetisation streams** — AdSense slots, affiliate banners, UPI/Ko-fi tips, job listings, digital products, courses, and sponsorships.
- **Deployed to Cloudflare Pages** via `@opennextjs/cloudflare`, with Vercel as an alternative target.
- **Supabase (PostgreSQL)** as the primary database and file storage backend.

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.1 |
| UI Styling | Tailwind CSS v4 | ^4 |
| Database | Supabase (PostgreSQL + RLS) | ^2.101.1 |
| Rich Text Editor | TipTap | ^3.21.0 |
| Dark Mode | next-themes | ^0.4.6 |
| Notifications | react-hot-toast | ^2.6.0 |
| Bot Protection | Cloudflare Turnstile | ^1.5.0 |
| HTML Sanitisation | isomorphic-dompurify | ^3.7.1 |
| Contact Forms | Formspree (`@formspree/react`) | ^3.0.0 |
| Analytics | Vercel Analytics + Speed Insights | ^2.0.x |
| Icons | lucide-react | ^1.7.0 |
| Slug generation | slugify | ^1.6.8 |
| Unique IDs | uuid | ^13.0.0 |
| Cloudflare adapter | @opennextjs/cloudflare | ^1.18.0 |
| Reading time | reading-time | ^1.5.0 |

---

## 3. Project Structure

```
blogverse/
├── app/                        # Next.js App Router pages & logic
│   ├── layout.js               # Root layout (fonts, providers, navbar, footer)
│   ├── page.js                 # Homepage (featured post + post grid)
│   ├── actions.js              # ALL server actions (posts, comments, reactions, jobs…)
│   ├── globals.css             # Global styles & Tailwind base
│   ├── robots.js               # Dynamic robots.txt
│   ├── sitemap.js              # Dynamic XML sitemap
│   ├── error.jsx               # Global error boundary
│   ├── loading.jsx             # Global loading UI
│   ├── not-found.jsx           # 404 page
│   ├── admin/
│   │   ├── add-job/page.jsx    # Admin: job listings CRUD
│   │   ├── comments/page.jsx   # Admin: comment moderation
│   │   └── posts/page.jsx      # Admin: post moderation
│   ├── advertise/page.jsx      # Sponsorship packages page
│   ├── api/
│   │   ├── upload/route.js     # Image upload endpoint (→ Supabase Storage)
│   │   └── debug/             # Debug utilities (dev only)
│   ├── category/[name]/page.jsx  # Category archive
│   ├── courses/page.jsx        # Curated courses listing
│   ├── edit/[slug]/page.jsx    # Edit-key-gated post editor
│   ├── jobs/page.jsx           # Community jobs board
│   ├── post/[slug]/page.jsx    # Single post view
│   ├── products/page.jsx       # Digital products / tools page
│   ├── search/page.jsx         # Full-text search page
│   ├── support/page.jsx        # Donation / tip page
│   ├── write/page.jsx          # New post composer
│   └── writer/[username]/page.jsx  # Author profile page
│
├── components/                 # Reusable React components
│   ├── AdSenseSlot.jsx
│   ├── AffiliateBanner.jsx
│   ├── BackToTop.jsx
│   ├── CategoryFilter.jsx
│   ├── CommentSection.jsx
│   ├── DeletePostButton.jsx
│   ├── EditKeyModal.jsx
│   ├── Editor.jsx
│   ├── Footer.jsx
│   ├── JobCard.jsx
│   ├── LoadMorePosts.jsx
│   ├── Navbar.jsx
│   ├── NewsletterForm.jsx
│   ├── PostCard.jsx
│   ├── ProductCard.jsx
│   ├── ReactionBar.jsx
│   ├── ReadingProgress.jsx
│   ├── ShareButtons.jsx
│   ├── TableOfContents.jsx
│   ├── ThemeProvider.jsx
│   ├── ThemeToggle.jsx
│   ├── TipButton.jsx
│   └── ViewIncrementer.jsx
│
├── db/
│   └── schema.sql              # Reference SQL schema (SQLite / Supabase-compatible)
│
├── lib/
│   ├── d1.js                   # CATEGORY_CONFIG, safeImageUrl, getSessionId
│   ├── supabase.js             # Supabase client singleton
│   └── utils.js                # parseTags helper
│
├── public/                     # Static assets
├── next.config.mjs             # Next.js config (images, CSP headers)
├── postcss.config.mjs
├── jsconfig.json               # Path aliases (@/ → root)
├── eslint.config.mjs
└── package.json
```

---

## 4. Environment Variables

Create a `.env.local` file at the project root with the following variables:

```env
# ─── Supabase ─────────────────────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>

# ─── Site ─────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ─── Admin ────────────────────────────────────────────────────────────────────
ADMIN_SECRET=<strong random password>
# Legacy env var used by some older code paths (kept for backwards compat)
NEXT_PUBLIC_ADMIN_PASSWORD=<same value as ADMIN_SECRET>

# ─── Bot protection (Cloudflare Turnstile) ────────────────────────────────────
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<site key from Cloudflare dashboard>
TURNSTILE_SECRET_KEY=<secret key from Cloudflare dashboard>

# ─── Monetisation ─────────────────────────────────────────────────────────────
NEXT_PUBLIC_UPI_ID=yourname@upi
NEXT_PUBLIC_KOFI_USERNAME=yourusername
NEXT_PUBLIC_FORMSPREE_ID=<Formspree form ID>
```

> **Security note:** `ADMIN_SECRET` must remain server-side only. Never expose it with the `NEXT_PUBLIC_` prefix.

---

## 5. Database Schema

The canonical schema lives in `db/schema.sql`. The production database is Supabase (PostgreSQL). The schema below mirrors that file with added field notes.

### `posts`

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT PK | UUID, generated server-side |
| `slug` | TEXT UNIQUE | URL-safe identifier (`slugify(title) + '-' + Date.now().toString(36)`) |
| `title` | TEXT | Max 200 chars |
| `excerpt` | TEXT | First 150 chars of plain text; max 500 chars |
| `content` | TEXT | HTML; sanitised by DOMPurify before storage |
| `category` | TEXT | One of: `health`, `tech`, `finance`, `student`, `business`, `eco` |
| `status` | TEXT | `'draft'` \| `'published'` \| `'hidden'` |
| `published_at` | DATETIME | Defaults to `CURRENT_TIMESTAMP` |
| `featured_image_url` | TEXT | External URL; validated by `safeImageUrl()` |
| `views` | INTEGER | Incremented via `increment_views` RPC |
| `author_avatar_url` | TEXT | External URL |
| `author_display_name` | TEXT | Max 80 chars |
| `author_bio` | TEXT | Used on public identity mode |
| `author_upi_id` | TEXT | Author's UPI ID for reader tips |
| `author_kofi_link` | TEXT | Author's Ko-fi page URL |
| `is_sponsored` | BOOLEAN | Sponsored content flag |
| `tags` | TEXT | JSON-stringified array e.g. `'["react","tips"]'` |
| `identity_mode` | TEXT | `'anonymous'` \| `'pseudonym'` \| `'public'` |
| `edit_key` | TEXT UNIQUE | UUID; shown to author only once after publish |

### `newsletter_subscribers`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | Auto-increment |
| `email` | TEXT UNIQUE | Subscriber email |
| `created_at` | DATETIME | |

### `comments`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | Auto-increment |
| `post_id` | TEXT FK → posts.id | Cascade delete |
| `parent_id` | INTEGER FK → comments.id | Nullable; enables nested replies |
| `display_name` | TEXT | Max 80 chars |
| `content` | TEXT | Plain text; stripped of HTML tags; max 2000 chars |
| `is_hidden` | BOOLEAN | Admin-moderated flag (soft delete) |
| `created_at` | DATETIME | |

### `reactions`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | Auto-increment |
| `post_id` | TEXT FK → posts.id | Cascade delete |
| `session_id` | TEXT | Browser session UUID stored in localStorage |
| `reaction_type` | TEXT | One of 5 emoji types |
| `created_at` | DATETIME | |
| UNIQUE | (`post_id`, `session_id`) | One reaction per session per post |

### `job_listings`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | Auto-increment |
| `title` | TEXT | |
| `company` | TEXT | Optional |
| `description` | TEXT | Optional |
| `category` | TEXT | Maps to `CATEGORY_CONFIG` keys |
| `apply_url` | TEXT | External application link |
| `is_active` | BOOLEAN | Soft-delete; only `true` rows are shown publicly |
| `created_at` | DATETIME | |

### `digital_products`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | Auto-increment |
| `title` | TEXT | |
| `description` | TEXT | |
| `price` | TEXT | Formatted string e.g. `'₹499'` |
| `category` | TEXT | |
| `thumbnail_url` | TEXT | |
| `gumroad_url` | TEXT | External purchase link |
| `created_at` | DATETIME | |

### `webinars`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | Auto-increment |
| `title` | TEXT | |
| `description` | TEXT | |
| `event_date` | DATETIME | |
| `registration_url` | TEXT | |
| `is_active` | BOOLEAN | |
| `created_at` | DATETIME | |

### `affiliate_clicks`

Tracks affiliate banner click-through events for analytics.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | Auto-increment |
| `name` | TEXT | Affiliate name; max 100 chars |
| `post_id` | TEXT | Optional — the post where the banner was clicked |
| `session_id` | TEXT | Browser session UUID |

---

## 6. Application Routes (Pages)

### Public pages

| Route | File | Rendering | Description |
|---|---|---|---|
| `/` | `app/page.js` | ISR (60 s) | Homepage: featured post (highest views), category filter, latest posts grid (12 per load), newsletter signup, affiliate sidebar |
| `/post/[slug]` | `app/post/[slug]/page.jsx` | Dynamic | Full post reader: title, content, author card, reading time, reactions, share buttons, comment section, related posts, ad slots |
| `/category/[name]` | `app/category/[name]/page.jsx` | Dynamic | Category archive with paginated post grid |
| `/write` | `app/write/page.jsx` | Client | New post form: identity mode picker, TipTap editor, Turnstile bot check |
| `/edit/[slug]` | `app/edit/[slug]/page.jsx` | Client | Two-step form: (1) verify edit key, (2) edit post fields |
| `/search` | `app/search/page.jsx` | Client | Debounced full-text search (400 ms) against title, excerpt, and tags |
| `/jobs` | `app/jobs/page.jsx` | ISR (300 s) | Community jobs board |
| `/products` | `app/products/page.jsx` | ISR (3600 s) | Recommended tools / affiliate products |
| `/courses` | `app/courses/page.jsx` | Static | Curated course listing (hard-coded) |
| `/advertise` | `app/advertise/page.jsx` | Static | Sponsorship packages |
| `/support` | `app/support/page.jsx` | Static | UPI / Ko-fi donation page |
| `/writer/[username]` | `app/writer/[username]/page.jsx` | Dynamic | Author profile with all posts by that display name |

### Admin pages (password-protected)

| Route | File | Description |
|---|---|---|
| `/admin/add-job` | `app/admin/add-job/page.jsx` | Add, view, and deactivate job listings |
| `/admin/comments` | `app/admin/comments/page.jsx` | View all comments; hide/unhide |
| `/admin/posts` | `app/admin/posts/page.jsx` | View all posts; hide, restore, or permanently delete |

Admin pages call `adminLoginAction` which sets an httpOnly `admin_token` cookie (SHA-256 hash of `ADMIN_SECRET`, valid for 24 h). All admin server actions call `requireAdmin()` to validate this cookie before proceeding.

### System routes

| Route | File | Description |
|---|---|---|
| `/sitemap.xml` | `app/sitemap.js` | Dynamic sitemap (posts + categories + static pages); cached 1 h |
| `/robots.txt` | `app/robots.js` | Disallows `/admin/`, `/api/`, `/_next/`, `/edit/` |

---

## 7. Server Actions (`app/actions.js`)

All mutations and protected reads are implemented as **Next.js Server Actions** (`'use server'`). They run on the server and are called directly from client components.

### Rate Limiting

An in-memory `Map` (`rateLimitMap`) provides per-key rate limiting within a single server process:

```
rateLimit(key, maxRequests, windowMs)
```

Applied to:
- `createPost` — 3 posts per minute per author name
- `subscribeNewsletter` — 2 attempts per hour per email
- `submitCommentAction` — 5 comments per minute per post

### Turnstile Verification

`verifyTurnstile(token)` sends the token to the Cloudflare Siteverify API. In development, if `TURNSTILE_SECRET_KEY` is unset, it bypasses the check with a warning. In production, an unconfigured key throws an error.

Applied to `createPost` and `submitCommentAction`.

### HTML Sanitisation

`DOMPurify.sanitize()` with `SANITIZE_OPTIONS` is applied to all HTML content before database writes (`createPost`, `updatePostAction`, `submitCommentAction`).

**Allowed tags:** `p br strong em u s h2 h3 h4 ul ol li blockquote pre code a img hr figure figcaption`  
**Allowed attributes:** `href src alt class target rel width height`  
**Forbidden:** `script style iframe object embed form`

---

### Post Actions

| Function | Auth | Description |
|---|---|---|
| `createPost(postData, turnstileToken)` | Rate-limited + Turnstile | Validate inputs, sanitise HTML, generate UUID + edit key, insert into `posts`, revalidate `/` |
| `updatePostAction(postData)` | Edit key verified upstream | Sanitise HTML, update post fields, revalidate post path |
| `deletePostAction(slug, editKey)` | Edit key required | Verify edit key matches, delete post, revalidate `/` |
| `getPostsPage({ page, limit, category })` | Public | Paginated posts query used by `LoadMorePosts` |

### Admin Post Actions

| Function | Auth | Description |
|---|---|---|
| `getAdminPostsAction({ page, limit })` | Admin cookie | Paginated list of all posts (any status) |
| `hidePostAction(id)` | Admin cookie | Set status to `'hidden'` |
| `restorePostAction(id)` | Admin cookie | Set status to `'published'` |
| `adminDeletePostAction(id)` | Admin cookie | Permanently delete post |

### View Tracking

`incrementViews(postId)` — Calls `increment_views` RPC in Supabase. Falls back to `increment_views_fallback` RPC, then raw SQL update.

### Search

`searchPostsAction(query)` — `ilike` filter on `title`, `excerpt`, and `tags`. Returns up to 20 results ordered by `views` descending. Minimum query length: 2 characters.

### Newsletter

`subscribeNewsletter(email)` — Insert into `newsletter_subscribers`. Returns `{ code: '23505' }` on duplicate email (unique constraint violation).

### Reactions

| Function | Description |
|---|---|
| `submitReaction(postId, sessionId, type)` | Insert reaction; revalidate post path |
| `loadReactions(postId, sessionId)` | Return all reactions for post + user's own reaction |

### Comments

| Function | Auth | Description |
|---|---|---|
| `fetchCommentsAction(postId)` | Public | Fetch visible comments for a post (ordered by `created_at` asc, max 100) |
| `submitCommentAction(postId, displayName, content, turnstileToken, parentId?)` | Rate-limited + Turnstile | Sanitise and insert comment; revalidate post path |
| `getAdminCommentsAction()` | Admin cookie | Fetch all comments with post titles |
| `hideCommentAction(commentId)` | Admin cookie | Set `is_hidden = true` |

### Edit Key

`verifyEditKey(slug, key)` — Fetch post by slug, compare edit key, return full post data on success.

### Jobs

| Function | Auth | Description |
|---|---|---|
| `getJobs()` | Public | Fetch all active job listings |
| `postJob(jobData)` | Admin cookie | Insert new job listing, revalidate `/jobs` |
| `deactivateJobAction(id)` | Public (no auth) | Set `is_active = false` |

> **Note:** `deactivateJobAction` currently lacks admin authentication. Only admins should be able to call it (tracked as a future improvement).

### Products

| Function | Description |
|---|---|
| `getProducts()` | Fetch all digital products ordered by `created_at` desc |
| `trackAffiliateClick(name, postId, sessionId)` | Record an affiliate click event |

### Admin Authentication

| Function | Description |
|---|---|
| `adminLoginAction(password)` | Verify password against `ADMIN_SECRET`; set httpOnly `admin_token` cookie (24 h) |
| `requireAdmin()` (internal) | Validate `admin_token` cookie; returns `true`/`false` |

---

## 8. API Routes

### `POST /api/upload`

Handles image uploads from the TipTap editor.

**Request:** `multipart/form-data` with a `file` field.

**Validations:**
- MIME type must be one of: `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `image/avif`
- File size must not exceed **5 MB**
- Filename is sanitised (timestamp + random hex + original extension)

**Flow:**
1. Read file buffer from `FormData`
2. Validate type and size
3. Upload to Supabase Storage bucket `blog-images` at path `post-images/<filename>`
4. Return public URL: `{ url: string }`

**Error responses:** `{ error: string }` with status 400 or 500.

---

## 9. Components

### Layout & Navigation

#### `Navbar`
Sticky top navigation. Contains the BlogVerse logo, links to Jobs / Products / Courses, a Search button, a dark-mode toggle, and the "Write a Post" CTA. Collapses into a hamburger menu on mobile.

#### `Footer`
Site footer with links and copyright notice.

#### `ThemeProvider`
Wraps the app in `next-themes`' `ThemeProvider` with `attribute="class"` and `defaultTheme="system"`.

#### `ThemeToggle`
Standalone sun/moon button (used in some admin pages).

---

### Post Discovery

#### `PostCard`
Displays a post preview card: featured image, category badge, title, excerpt (line-clamped), author avatar + name, date, and view count. Links to `/post/[slug]`.

#### `CategoryFilter`
Client component that renders category pills. Clicking a pill navigates to `/category/[key]`. Highlights the active category based on the current URL.

#### `LoadMorePosts`
Client component. Receives `initialPosts`, `pageSize`, `totalPosts`, and optionally `category`. On "Load More" click, calls `getPostsPage` server action and appends results to the grid.

---

### Writing & Editing

#### `Editor`
TipTap rich-text editor component. Extensions: StarterKit (headings H2/H3, bold, italic, lists, blockquote, code blocks), Image, Link, Placeholder.

Features:
- Toolbar with Bold, Italic, H2, H3, Blockquote, Bullet List, Numbered List, Code Block, Horizontal Rule, Image Upload, Link Insert
- Image upload via `POST /api/upload`; inserted at cursor position
- Inline link input popover
- Auto "Copy" button injected into all code block `<pre>` elements via MutationObserver
- Live stats: character count, word count, estimated reading time

#### `EditKeyModal`
Modal dialog shown immediately after a post is successfully published. Displays the unique edit key with a copy button and warning to save it. Closes by navigating to the new post.

---

### Post Page

#### `ReadingProgress`
Thin progress bar at the top of the page that fills as the user scrolls through the article.

#### `ViewIncrementer`
Invisible client component mounted on every post page. Calls `incrementViews(postId)` once on mount via `useEffect`.

#### `TableOfContents`
Parses `h2` and `h3` headings from the post HTML. Renders a scrollable sticky list of anchor links. Highlights the currently-visible heading using `IntersectionObserver`.

#### `ReactionBar`
Displays 5 emoji reaction buttons (e.g. ❤️ 👍 🤔 🔥 😂). Reads the reader's existing reaction from `sessionId`. Calls `submitReaction` on click; disables the bar after one reaction per session.

#### `ShareButtons`
WhatsApp, Twitter/X, and Copy-Link buttons for sharing the current post URL.

#### `CommentSection`
Fetches and displays threaded comments. Supports top-level comments and one level of replies. Each form is protected by Turnstile. Calls `submitCommentAction` and `fetchCommentsAction`. Uses `useMemo` to build the parent → children tree.

#### `TipButton`
Rendered in the sidebar when the post author has provided a UPI ID or Ko-fi link. Shows a tip prompt with a link to the UPI deep-link or Ko-fi page.

#### `DeletePostButton`
Prompts the reader to enter their edit key, then calls `deletePostAction`. On success, redirects to `/`.

#### `BackToTop`
Floating button that appears after scrolling 300 px down. Smooth-scrolls to top on click.

---

### Monetisation

#### `AdSenseSlot`
Placeholder `<div>` for Google AdSense ad units. Accepts a `size` prop (`'leaderboard'` | `'rectangle'` | `'article'`) which determines dimensions. Replace the placeholder content with the actual AdSense embed code.

#### `AffiliateBanner`
Reads `CATEGORY_CONFIG[category].affiliate` and renders a styled banner with the affiliate's name, description, and a tracked outbound link. Calls `trackAffiliateClick` on click. Accepts optional `postId` to associate the click with a post.

---

### Forms & Misc

#### `NewsletterForm`
Email input form. Calls `subscribeNewsletter`. Shows success/already-subscribed/error toasts.

#### `JobCard`
Renders a single job listing card: title, company, description, category badge, and an "Apply Now" link.

#### `ProductCard`
Renders a digital product card: thumbnail (or emoji fallback), title, description, price badge, category, and a Gumroad/external purchase link.

---

## 10. Library Modules (`lib/`)

### `lib/supabase.js`

Exports a single **Supabase client** singleton:

```js
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
```

Used in server actions and server components. Row Level Security (RLS) should be configured in the Supabase dashboard to match intended access patterns.

---

### `lib/d1.js`

Contains all category-related configuration and two utility functions.

#### `CATEGORY_CONFIG`

A map from category key → config object:

```js
{
  health: {
    label: 'Health & Wellness',
    color: 'health',
    emoji: '🌿',
    badgeClass: '...',    // Tailwind badge styles
    borderClass: '...',  // Tailwind border styles
    bgClass: '...',       // Tailwind background styles
    btnClass: '...',      // Tailwind button styles
    affiliate: { name, url, desc }
  },
  tech: { … },
  finance: { … },
  student: { … },
  business: { … },
  eco: { … },
}
```

Also exports:
- `CATEGORIES` — array of category keys
- `safeImageUrl(url)` — returns the URL if it is a valid `http`/`https` URL, otherwise `null`
- `getSessionId()` — reads or creates a UUID in `localStorage` under key `blogverse_session`; returns `null` on the server

---

### `lib/utils.js`

#### `parseTags(raw)`

Safely parses tags from the database's stored format (a JSON-stringified array string) into a plain JavaScript array:

- `null` / `undefined` → `[]`
- Already an array → filtered for truthy values
- JSON string → `JSON.parse` → filtered

Safe to import in both client and server components.

---

## 11. Security

### Content Security Policy

Set via `next.config.mjs` for all routes:

```
default-src 'self'
script-src  'self' 'unsafe-inline' [+'unsafe-eval' in dev] https://challenges.cloudflare.com https://va.vercel-scripts.com
style-src   'self' 'unsafe-inline' https://fonts.googleapis.com
img-src     'self' data: https:
font-src    'self' https://fonts.gstatic.com
connect-src 'self' https://*.supabase.co wss://*.supabase.co https://va.vercel-scripts.com https://challenges.cloudflare.com https://vitals.vercel-insights.com
frame-src   https://challenges.cloudflare.com
object-src  'none'
upgrade-insecure-requests
```

### Additional Security Headers

| Header | Value |
|---|---|
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

### Crawl Protection (robots.txt)

Disallowed paths: `/admin/`, `/api/`, `/_next/`, `/edit/`

### Input Validation

`createPost` validates all inputs server-side before inserting:

| Field | Constraint |
|---|---|
| `title` | Min 5, max 200 chars |
| `slug` | Regex `^[a-z0-9-]+$`, max 200 chars |
| `content` | Min 50 chars |
| `category` | Must be one of the 6 valid values |
| `author_display_name` | Min 2, max 80 chars |
| `excerpt` | Max 500 chars |

### HTML Sanitisation

All user-supplied HTML is passed through DOMPurify (`isomorphic-dompurify`) before storage. Comment content is stripped of all HTML tags entirely.

### Bot Protection

Cloudflare Turnstile challenges are required on post creation and comment submission. The server-side secret key verification happens in `verifyTurnstile()`.

### Admin Authentication

Admin routes use an httpOnly, SameSite-strict cookie containing the SHA-256 hash of `ADMIN_SECRET`. The cookie expires after 24 hours. The plaintext password is never stored anywhere.

### Rate Limiting

In-memory rate limiter prevents burst abuse of the create post, newsletter subscribe, and comment submit endpoints. Limits reset on server restart (in-process state).

---

## 12. Monetisation

| Stream | Implementation |
|---|---|
| **Google AdSense** | `AdSenseSlot` component with placeholder `div`s at leaderboard, rectangle, and article sizes. Swap content with live AdSense embed scripts. |
| **Affiliate banners** | `AffiliateBanner` component reads per-category affiliate config from `CATEGORY_CONFIG`. Clicks tracked in `affiliate_clicks` table. |
| **Author UPI tips** | `TipButton` component shows a UPI deep-link (`upi://pay?pa=...`) if the post author provided their UPI ID. |
| **Ko-fi tips** | `TipButton` also shows a Ko-fi link if the author provided one. |
| **Job listings** | Paid job posts managed at `/admin/add-job`. Advertisers pay ₹199 via UPI (manual process). |
| **Digital products** | `ProductCard` on `/products` links to Gumroad pages. Can be populated from the `digital_products` DB table or falls back to curated hard-coded list. |
| **Courses** | `/courses` page with hard-coded affiliate links to Udemy and Coursera courses. |
| **Sponsorships** | `/advertise` page listing ₹500–₹3,000 sponsor packages. Inquiries handled via Formspree contact form. |
| **Newsletter sponsorships** | ₹1,000 per sponsored newsletter issue (manual). |

---

## 13. SEO & Metadata

### Root Metadata (`app/layout.js`)

```js
export const metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "BlogVerse – Write, Share, Earn", template: "%s | BlogVerse" },
  description: "…",
  openGraph: { type: "website", locale: "en_IN", images: ["/og-default.png"], … },
  twitter:  { card: "summary_large_image", images: ["/og-default.png"], … },
  robots:   { index: true, follow: true },
}
```

### Per-Post Metadata (`app/post/[slug]/page.jsx`)

`generateMetadata` fetches the post from the database and returns:
- `title` → post title
- `description` → post excerpt
- `openGraph.images` → post `featured_image_url` or `/og-default.png`

### Category Metadata (`app/category/[name]/page.jsx`)

`generateMetadata` generates category-specific title and description.

### Sitemap (`app/sitemap.js`)

Returns three groups of URLs:
1. **Static pages** (priority 1.0 for `/`, 0.8 for others; `changeFrequency: daily`)
2. **Category pages** (priority 0.5; `changeFrequency: weekly`)
3. **Post pages** — fetched from Supabase (priority 0.7; `changeFrequency: monthly`)

Cached for 1 hour via `export const revalidate = 3600`.

---

## 14. Deployment

### Cloudflare Pages (primary)

```bash
npm run build:worker    # builds via @opennextjs/cloudflare
npm run deploy          # runs build:worker then wrangler pages deploy .open-next
npm run preview         # local Cloudflare Workers preview
```

### Vercel (alternative)

1. Import the GitHub repository on [vercel.com](https://vercel.com)
2. Add all environment variables from `.env.local`
3. Click **Deploy** — Next.js is auto-detected

---

## 15. Development

### Prerequisites

- Node.js 20+
- npm 9+

### Setup

```bash
git clone https://github.com/HEMANTH-S-KUMAR-1/blogverse.git
cd blogverse
npm install
cp .env.local.example .env.local   # or create manually
# Fill in environment variables
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `next dev` | Development server with HMR |
| `build` | `next build` | Production build |
| `start` | `next start` | Run production build locally |
| `lint` | `eslint` | ESLint checks |
| `build:worker` | `node build-worker.mjs` | Cloudflare Workers build |
| `deploy` | `npm run build:worker && wrangler pages deploy .open-next` | Deploy to Cloudflare Pages |
| `preview` | `opennextjs-cloudflare preview` | Local Cloudflare preview |

### Path Aliases

Configured in `jsconfig.json`:

```json
{ "paths": { "@/*": ["./*"] } }
```

Use `@/components/...`, `@/lib/...`, `@/app/...` etc. throughout the codebase.

### Key Conventions

- All database mutations are **server actions** in `app/actions.js`.
- Client components are marked with `'use client'` at the top.
- Server pages use `async`/`await` directly (no API round-trips needed).
- Content is sanitised **before** writing to the database, not after reading.
- Session-based features (reactions, session ID) use `localStorage` key `blogverse_session`.
- Tags are stored as a JSON-stringified array and parsed with `parseTags()` whenever read.
- ISR revalidation is triggered programmatically via `revalidatePath()` inside server actions after each mutation.
