import Link from 'next/link'
import Image from 'next/image'
import { clsx } from 'clsx'
import { getBlogPosts } from '../../db/blog'
import { getPlaceholderColorFromLocal } from '../../../lib/images'

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
      placeholder: {},
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
    <section className={clsx('mt-3 grid grid-cols-2 gap-4')}>
      {allBlogs.map((post) => (
        <Link
          key={post.slug}
          className="flex flex-col space-y-2"
          href={`/blog/inside/${post.slug}`}
        >
          <div className="flex w-full flex-col">
            {post.metadata.image && (
              <div
                className={'relative h-[150px] w-full rounded-xl'}
                style={{
                  backgroundColor: placeholderImageBlogMap.get(post.slug)
                    .placeholder.hex,
                }}
              >
                <Image
                  alt={post.metadata.title}
                  className="rounded-xl object-cover transition-all duration-500 ease-linear dark:brightness-75 dark:hover:brightness-100"
                  src={post.metadata.image}
                  fill
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/5 dark:ring-white/5" />
              </div>
            )}
            <p className="text-md mt-2 font-medium tracking-tighter transition-all hover:text-stone-500">
              {post.metadata.title}
            </p>
            <div className="flex items-center gap-1">
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                {blogPostDate(post.metadata.publishedAt)}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </section>
  )
}

function blogPostDate(date: string) {
  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }
  const d = new Date(date)
  return `${d.getFullYear()}年${d.getMonth() + 1}月`
}
