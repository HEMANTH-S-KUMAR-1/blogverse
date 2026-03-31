-- db/schema.sql

CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  status TEXT DEFAULT 'draft',
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  featured_image_url TEXT,
  views INTEGER DEFAULT 0,
  author_avatar_url TEXT,
  author_display_name TEXT,
  author_bio TEXT,
  author_upi_id TEXT,
  author_kofi_link TEXT,
  is_sponsored BOOLEAN DEFAULT FALSE,
  tags TEXT, -- Store JSON array as TEXT in SQLite
  identity_mode TEXT,
  edit_key TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id TEXT NOT NULL,
  parent_id INTEGER,
  display_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY(parent_id) REFERENCES comments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  reaction_type TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, session_id),
  FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
);
