CREATE TABLE IF NOT EXISTS guestbook (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  body TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT DEFAULT (datetime('now', 'localtime')),
  is_reply INTEGER DEFAULT 0,
  reply_to INTEGER DEFAULT 0,
  slug TEXT DEFAULT 'guestbook',
  is_banner INTEGER DEFAULT 0,
  banner_url TEXT DEFAULT ''
);
