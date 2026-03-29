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
      const key = url.searchParams.get('key')

      const guestbooks = await env.DB.prepare(
        'SELECT * FROM guestbook WHERE slug = ? AND is_reply = 1 ORDER BY created_at DESC'
      ).bind(slug).all()

      const replies = await env.DB.prepare(
        'SELECT * FROM guestbook WHERE slug = ? AND is_reply = 2 ORDER BY created_at ASC'
      ).bind(slug).all()

      // If key is correct, include email field
      const includeEmail = key === 'me'

      const formattedGuestbooks = guestbooks.results.map((entry: Record<string, unknown>) => {
        if (includeEmail) {
          return entry
        }
        const { email, ...rest } = entry
        return rest
      })

      const formattedReplies = replies.results.map((entry: Record<string, unknown>) => {
        if (includeEmail) {
          return entry
        }
        const { email, ...rest } = entry
        return rest
      })

      return Response.json({
        guestbooks: formattedGuestbooks,
        replies: formattedReplies,
      }, { headers: corsHeaders })
    }

    if (url.pathname === '/api/guestbook' && request.method === 'POST') {
      try {
        const { body, created_by, email = '', slug = 'guestbook', reply_to } = await request.json()

        if (!body || !created_by) {
          return Response.json({ error: 'Missing body or created_by' }, { status: 400, headers: corsHeaders })
        }

        // Check if this is a blog owner reply
        if (created_by === 'me' && email === 'me@email.com') {
          let targetId: number

          // If explicit reply_to is provided, use it; otherwise auto-find latest unreplied
          if (reply_to) {
            targetId = Number(reply_to)
          } else {
            const latestGuest = await env.DB.prepare(
              `SELECT g.id FROM guestbook g
               WHERE g.slug = ? AND g.is_reply = 1 AND g.reply_to = 0
               AND NOT EXISTS (
                 SELECT 1 FROM guestbook r WHERE r.reply_to = g.id AND r.is_reply = 2
               )
               ORDER BY g.created_at DESC LIMIT 1`
            ).bind(slug).first()

            if (!latestGuest) {
              return Response.json({ error: 'No unreplied guest message found' }, { status: 400, headers: corsHeaders })
            }
            targetId = latestGuest.id as number
          }

          const result = await env.DB.prepare(
            'INSERT INTO guestbook (body, created_by, email, slug, is_reply, reply_to) VALUES (?, ?, ?, ?, 2, ?)'
          ).bind(body, 'zlflly2005', email, slug, targetId).run()

          const newEntry = await env.DB.prepare(
            'SELECT * FROM guestbook WHERE id = ?'
          ).bind(result.meta.last_row_id).first()

          return Response.json({ success: true, entry: newEntry }, { headers: corsHeaders })
        }

        // Normal guestbook entry
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
