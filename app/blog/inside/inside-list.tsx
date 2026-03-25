/*
 * ============================================================
 * 动画说明 - Inside 页面列表图片动画
 * ============================================================
 *
 * 【实现原理】
 * 与 blog-list-client.tsx 的 restBlogs 动画完全一致：
 * 1. 背景占位: 使用 placeholder.hex 颜色作为背景色
 * 2. 图片加载: 原生 <img> 标签 + loading="lazy"
 * 3. 过渡动画: transition-all duration-500 + dark:brightness-75/100
 * 4. 光环效果: ring-1 ring-inset ring-gray-900/5 dark:ring-white/5
 *
 * 【代码级实现】
 * - 背景色通过 style={{ backgroundColor: placeholder.hex }} 设置
 * - 图片使用原生 <img> 标签，宽度高度自适应
 * - 容器使用 overflow-hidden + rounded-xl 裁剪
 *
 * 【一致性要求】
 * 如果修改此动画，必须同步修改：
 *   - app/components/blog-list-client.tsx（restBlogs 部分）
 *   - 两个文件使用完全相同的图片动画模式
 *
 * ============================================================
 */

import Link from 'next/link'
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
      placeholder: { hex: '#ffffff' },
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
                className="relative rounded-xl"
                style={{
                  backgroundColor:
                    placeholderImageBlogMap.get(post.slug).placeholder.hex,
                }}
              >
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/5 dark:ring-white/5" />
                <img
                  alt={post.metadata.title}
                  src={post.metadata.image}
                  width={
                    placeholderImageBlogMap.get(post.slug).metadata?.width || 800
                  }
                  height={
                    placeholderImageBlogMap.get(post.slug).metadata?.height || 450
                  }
                  className="rounded-xl object-cover transition-all duration-500 ease-linear dark:brightness-75 dark:hover:brightness-100"
                  loading="lazy"
                />
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