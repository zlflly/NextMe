import Link from 'next/link'
import { clsx } from 'clsx'
import { getBlogPosts } from '../../db/blog'

export default async function InsideList() {
  let allBlogs = getBlogPosts()

  allBlogs = allBlogs.filter((post) => post.metadata.category === 'Inside')

  allBlogs.sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1
    }
    return 1
  })
  return (
    <section className={clsx('mt-3 grid grid-cols-2 gap-4')}>
      {allBlogs.map((post) => (
        <Link
          key={post.slug}
          className="flex flex-col space-y-2"
          href={`/blog/inside/${post.slug}`}
        >
          <div className="flex w-full flex-col">
            <p className="text-md font-medium tracking-tighter transition-all hover:text-stone-500">
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
