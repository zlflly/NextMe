# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NextMe is a minimalist personal blog built with Next.js 14, featuring MDX-based blog posts with static HTML export for optimal performance and SEO.

## Commands

```bash
bun i          # Install dependencies
bun run dev    # Start development server (http://localhost:3000)
bun run build  # Build static export to out/ directory
bun start      # Serve the static out/ directory
```

## Architecture

### Blog Post System
- **Content location**: `content/` directory with `.mdx` files
- **Frontmatter fields**: `title`, `publishedAt`, `summary`, `image`, `category`, `ai`, `rssImage`
- **Categories**: Tech (appears in sitemap, RSS) and Daily (excluded from sitemap)
- **URL structure**: `/blog/tech/[slug]` and `/blog/daily/[slug]`

### Key Files
- `app/db/blog.ts` - MDX parsing, frontmatter extraction, blog post retrieval via `getBlogPosts()`
- `lib/images.ts` - Sharp-based image optimization with plaiceholder for blur-up loading
- `lib/utils.ts` - `cn()` utility combining tailwind-merge and clsx
- `app/blog-data/route.ts` - API endpoint returning blog post metadata
- `next.config.mjs` - Static export config (`output: 'export'`)

### Routing
- `/` - Home page with profile, photos section, GitHub link
- `/blog` - Blog list with Tech/Daily category switcher
- `/blog/tech/[slug]` - Tech blog post pages
- `/blog/daily/[slug]` - Daily blog post pages
- `/work` - Project showcase pages
- `/guestbook` - Guestbook page
- `/uses` - Uses page

### Environment Variables
- `SITE_URL` - Your site URL (required for sitemap and metadata)
- `SITE_AUTHOR` - Your name
- `ANALYZE=true` - Enable bundle analyzer

### Styling
- Tailwind CSS with `@tailwindcss/typography` plugin
- Dark mode via `dark:` classes
- Geist font family (sans and mono)

## Adding Content

Create a new `.mdx` file in `content/` with frontmatter:
```mdx
---
title: 'Your Post Title'
publishedAt: '2024-04-25'
summary: 'Brief description'
image: '/blog-img/your-post/cover.webp'
rssImage: '/blog-img/your-post/cover.jpeg'
category: 'Tech'
ai: 'AI-generated summary...'
---

Your markdown content here...
```

Static images go in `public/`, blog images typically in `public/blog-img/`.
