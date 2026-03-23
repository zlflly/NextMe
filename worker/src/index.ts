export interface Env {
  DB: D1Database
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/api/guestbook' && request.method === 'GET') {
      const slug = url.searchParams.get('slug') || 'guestbook'

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

    if (url.pathname === '/api/guestbook' && request.method === 'POST') {
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

    return new Response('Not Found', { status: 404 })
  },
}
