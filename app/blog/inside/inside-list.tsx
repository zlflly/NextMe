import { getBlogPosts } from '../../db/blog'
import { getPlaceholderColorFromLocal } from '../../../lib/images'
import InsideListClient from './inside-list-client'

type PlaceholderImage = Awaited<ReturnType<typeof getPlaceholderColorFromLocal>>

export default async function InsideList() {
  let allBlogs = getBlogPosts()

  allBlogs = allBlogs.filter((post) => post.metadata.category === 'Inside')

  allBlogs.sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1
    }
    return 1
  })

  // 并行加载所有博客的占位图
  const placeholderPromises = allBlogs.map(async (post): Promise<{ slug: string; placeholderImage: PlaceholderImage }> => {
    if (post?.metadata.image) {
      const placeholderImage = await getPlaceholderColorFromLocal(
        post.slug,
        post.metadata.image
      )
      return { slug: post.slug, placeholderImage }
    }
    return {
      slug: post.slug,
      placeholderImage: {
        slug: post.slug,
        src: '',
        placeholder: {
          r: 255,
          g: 255,
          b: 255,
          hex: '#ffffff',
          blurDataURL:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOsa2yqBwAFCAICLICSyQAAAABJRU5ErkJggg==',
        },
      } as PlaceholderImage,
    }
  })

  const placeholderResults = await Promise.all(placeholderPromises)
  const placeholderImageBlogMap = new Map(
    placeholderResults.map((r) => [r.slug, r.placeholderImage])
  )

  return (
    <InsideListClient
      blogs={allBlogs}
      placeholderImageBlogMap={placeholderImageBlogMap}
    />
  )
}
