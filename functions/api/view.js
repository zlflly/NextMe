export async function onRequest(context) {
  const url = new URL(context.request.url)
  const path = url.searchParams.get('path')

  if (!path) {
    return new Response(JSON.stringify({ error: 'Missing path parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const kv = context.env.PAGE_VIEWS
  if (!kv) {
    return new Response(JSON.stringify({ error: 'KV not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const key = `view:${path}`
  const currentValue = await kv.get(key)
  const newValue = currentValue ? parseInt(currentValue, 10) + 1 : 1

  await kv.put(key, newValue.toString())

  return new Response(JSON.stringify({ views: newValue }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  })
}
