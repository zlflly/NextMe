import { getBlogPosts } from '../../db/blog'
import { getPlaceholderColorFromLocal } from '../../../lib/images'
import InsideListClient from './inside-list-client'

export default async function InsideList() {
  let allBlogs = getBlogPosts()

  allBlogs = allBlogs.filter((post) => post.metadata.category === 'Inside')

  allBlogs.sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1
    }
    return 1
  })

  let placeholderImageBlogMap = new Map()
  for (const post of allBlogs) {
    let placeholderImage: { src: string; placeholder: any; metadata?: any } = {
      src: '',
      placeholder: {
        hex: '#ffffff',
        blurDataURL:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOsa2yqBwAFCAICLICSyQAAAABJRU5ErkJggg==',
      },
      metadata: { width: 800, height: 450 },
    }
    if (post?.metadata.image) {
      placeholderImage = await getPlaceholderColorFromLocal(
        post.slug,
        post.metadata.image
      )
    }
    placeholderImageBlogMap.set(post.slug, placeholderImage)
  }

  return (
    <InsideListClient
      blogs={allBlogs}
      placeholderImageBlogMap={placeholderImageBlogMap}
    />
  )
}
