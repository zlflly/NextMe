import RSS from 'rss'
import { getBlogPosts } from '../db/blog'

export const dynamic = 'force-static'

export async function GET() {
  const siteUrl = process.env.SITE_URL!
  const siteAuthor = process.env.SITE_AUTHOR || 'Hamster1963'

  const feed = new RSS({
    title: siteAuthor,
    description: 'Student, amateur researcher.',
    site_url: siteUrl,
    feed_url: siteUrl + '/rss',
    language: 'zh-CN',
    image_url: siteUrl + '/avatar.jpeg',
    generator: 'Next.js',
    custom_elements: [
      { 'itunes:author': siteAuthor },
      { 'itunes:owner': [{ 'itunes:name': siteAuthor }, { 'itunes:email': 'noreply@example.com' }] },
      { 'itunes:explicit': 'false' },
      { 'itunes:image': { _attr: { href: siteUrl + '/avatar.jpeg' } } },
    ],
  })

  const getPost = getBlogPosts()
  const posts = getPost.filter((post) => post.metadata.category !== 'Daily')

  posts.forEach((post) => {
    const postUrl = siteUrl + `/blog/tech/${post.slug}`
    const description = post.metadata.ai ? post.metadata.ai : post.metadata.summary
    const imageUrl = post.metadata.rssImage
      ? siteUrl + post.metadata.rssImage
      : siteUrl + '/opengraph-image.png'

    feed.item({
      title: post.metadata.title,
      description,
      url: postUrl,
      date: post.metadata.publishedAt,
      author: siteAuthor,
      categories: [post.metadata.category],
      enclosure: {
        url: imageUrl,
        type: 'image/jpeg',
      },
      custom_elements: [
        { 'content:encoded': `<![CDATA[${description}]]>` },
      ],
    })
  })

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'content-type': 'text/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  })
}
