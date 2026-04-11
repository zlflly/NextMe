// 搜索引擎爬虫 UA 列表
const CRAWLER_UA_PATTERNS = [
  /googlebot/i,
  /bingbot/i,
  /baiduspider/i,
  /yandexbot/i,
  /duckduckbot/i,
  /sogou.*spider/i,
  /twitterbot/i,
  /facebookexternalhit/i,
  /applebot/i,
  /semrushbot/i,
  /ahrefsbot/i,
  /petalbot/i,
  /bytespider/i,
  /google-other/i,
  / GPTBot/i,
  /ClaudeBot/i,
  /anthropic-ai/i,
  /ai2bot/i,
  /aiBot/i,
  /cohere-ai/i,
  / FriendlyCrawler/i,
  /Imagesiftbot/i,
  /KodiBot/i,
  /MetaAI/i,
  /OmbotBot/i,
  /Pinterestbot/i,
  /Scrapy/i,
  /Slackbot/i,
  /TelegramBot/i,
  /ViberBot/i,
  /WhatsApp/i,
  /YouBot/i,
  /CCBot/i,
  /Diffbot/i,
  /discobot/i,
  /EmailMarketingRobot/i,
  /flipboard/i,
  /linkdexbot/i,
  /okhttp/i,
  /outbrain/i,
  /pinterest/i,
  /redditbot/i,
  /roaming mammal/i,
  /sitebulb/i,
  /slurp/i,
  /Yahooyarps/i,
]

function isCrawler(request) {
  const ua = request.headers.get('user-agent') || ''
  return CRAWLER_UA_PATTERNS.some((pattern) => pattern.test(ua))
}

export async function onRequest(context) {
  // 检测爬虫，跳过计数
  if (isCrawler(context.request)) {
    return new Response(JSON.stringify({ views: 0, crawler: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

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
