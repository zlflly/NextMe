export interface Env {
  DB: D1Database
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

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
      }, { headers: corsHeaders })
    }

    if (url.pathname === '/api/guestbook' && request.method === 'POST') {
      try {
        const { body, created_by, email = '', slug = 'guestbook' } = await request.json()

        if (!body || !created_by) {
          return Response.json({ error: 'Missing body or created_by' }, { status: 400, headers: corsHeaders })
        }

        const result = await env.DB.prepare(
          'INSERT INTO guestbook (body, created_by, email, slug, is_reply, reply_to) VALUES (?, ?, ?, ?, 1, 0)'
        ).bind(body, created_by, email, slug).run()

        const newEntry = await env.DB.prepare(
          'SELECT * FROM guestbook WHERE id = ?'
        ).bind(result.meta.last_row_id).first()

        return Response.json({ success: true, entry: newEntry }, { headers: corsHeaders })
      } catch (error) {
        return Response.json({ error: 'Failed to create entry' }, { status: 500, headers: corsHeaders })
      }
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders })
  },
}
