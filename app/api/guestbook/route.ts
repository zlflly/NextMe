import { D1Database } from '@cloudflare/workers-types'

export const runtime = 'edge'

export async function GET(request: Request, { env }: { env: { DB: D1Database } }) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug') || 'guestbook'

  const guestbooks = await env.DB.prepare(
    'SELECT * FROM guestbook WHERE slug = ? AND is_reply = 1 ORDER BY created_at DESC'
  ).bind(slug).all()

  const replies = await env.DB.prepare(
    'SELECT * FROM guestbook WHERE slug = ? AND is_reply = 2 ORDER BY created_at ASC'
  ).bind(slug).all()

  return Response.json({
    guestbooks: guestbooks.results,
    replies: replies.results,
  })
}

export async function POST(request: Request, { env }: { env: { DB: D1Database } }) {
  try {
    const { body, created_by, slug = 'guestbook' } = await request.json()

    if (!body || !created_by) {
      return Response.json({ error: 'Missing body or created_by' }, { status: 400 })
    }

    const result = await env.DB.prepare(
      'INSERT INTO guestbook (body, created_by, slug, is_reply, reply_to) VALUES (?, ?, ?, 1, 0)'
    ).bind(body, created_by, slug).run()

    const newEntry = await env.DB.prepare(
      'SELECT * FROM guestbook WHERE id = ?'
    ).bind(result.meta.last_row_id).first()

    return Response.json({ success: true, entry: newEntry })
  } catch (error) {
    return Response.json({ error: 'Failed to create entry' }, { status: 500 })
  }
}
