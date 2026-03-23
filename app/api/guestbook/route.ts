// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Env = { env: { DB: any } }

export const runtime = 'edge'

export async function GET(request: Request, context: Env) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug') || 'guestbook'
  const db = (context as any).env?.DB || (globalThis as any).env?.DB

  const guestbooks = await db.prepare(
    'SELECT * FROM guestbook WHERE slug = ? AND is_reply = 1 ORDER BY created_at DESC'
  ).bind(slug).all()

  const replies = await db.prepare(
    'SELECT * FROM guestbook WHERE slug = ? AND is_reply = 2 ORDER BY created_at ASC'
  ).bind(slug).all()

  return Response.json({
    guestbooks: guestbooks.results,
    replies: replies.results,
  })
}

export async function POST(request: Request, context: Env) {
  try {
    const { body, created_by, slug = 'guestbook' } = await request.json()
    const db = (context as any).env?.DB || (globalThis as any).env?.DB

    if (!body || !created_by) {
      return Response.json({ error: 'Missing body or created_by' }, { status: 400 })
    }

    const result = await db.prepare(
      'INSERT INTO guestbook (body, created_by, slug, is_reply, reply_to) VALUES (?, ?, ?, 1, 0)'
    ).bind(body, created_by, slug).run()

    const newEntry = await db.prepare(
      'SELECT * FROM guestbook WHERE id = ?'
    ).bind(result.meta.last_row_id).first()

    return Response.json({ success: true, entry: newEntry })
  } catch (error) {
    return Response.json({ error: 'Failed to create entry' }, { status: 500 })
  }
}
