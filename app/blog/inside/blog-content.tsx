/*
 * ============================================================
 * 动画说明 - Inside 文章封面图片动画
 * ============================================================
 *
 * 【实现原理】
 * 使用 BlurImage 组件实现 blur-up 动画（与 Tech 文章一致）：
 * 1. 初始状态: opacity-0 blur-lg（透明 + 模糊）
 * 2. 加载完成: onLoad 触发后切换 opacity-100 blur-0
 * 3. 过渡时长: transition-all duration-500（500ms）
 * 4. 点击放大: 桌面端点击触发 framer-motion AnimatePresence 放大弹窗
 *
 * 【代码级实现】
 * - 引入 BlurImage 组件 from '../../components/blog-image'
 * - 使用 getPlaceholderColorFromLocal 获取 hex 背景色
 * - BlurImage 组件内部处理 isLoading 状态和 onLoad 事件
 *
 * 【一致性要求】
 * 如果修改此动画，必须同步修改以下文件（使用相同 BlurImage 组件）：
 *   - app/blog/tech/[slug]/blog-content.tsx
 *   - app/blog/daily/[slug]/blog-content.tsx
 *   - app/components/blog-image.tsx（核心组件）
 *
 * ============================================================
 */

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CustomMDX } from '../../components/mdx'
import { getBlogPosts } from '../../db/blog'
import { getPlaceholderColorFromLocal } from '../../../lib/images'
import { BackIcon } from '../../components/Icon'
import BlurImage from '../../components/blog-image'

export default async function BlogContent({ slug }) {
  const getPost = getBlogPosts()

  if (!getPost) {
    notFound()
  }
  let post = getPost.find((post) => post.slug === slug)

  let placeholderImage
  if (post?.metadata.image) {
    placeholderImage = await getPlaceholderColorFromLocal(
      post.slug,
      post.metadata.image
    )
  }

  if (!post) {
    notFound()
  }
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? process.env.SITE_URL + post.metadata.image
              : process.env.SITE_URL + '/og?title=' + post.metadata.title,
            url: process.env.SITE_URL + '/blog/inside/' + post.slug,
            author: {
              '@type': 'Person',
              name: process.env.SITE_AUTHOR,
            },
          }),
        }}
      />
      <h1 className="mb-2 text-2xl font-medium tracking-tighter transition-opacity hover:opacity-50">
        <Link
          style={{
            viewTransitionName: post.metadata.title,
          }}
          href={'/blog/inside'}
          className="flex items-center justify-start"
        >
          <BackIcon />
          {post.metadata.title}
        </Link>
      </h1>
      <div className="mb-8 mt-2 flex max-w-[650px] items-center justify-between text-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(post.metadata.publishedAt)}
        </p>
      </div>
      <div className="flex w-full flex-col">
        {post.metadata.image && (
          <div className="z-20 overflow-hidden rounded-xl">
            <BlurImage
              src={post.metadata.image}
              alt={post.metadata.title}
              width={
                placeholderImage.metadata?.width
                  ? placeholderImage.metadata.width
                  : 1920
              }
              height={
                placeholderImage.metadata?.height
                  ? placeholderImage.metadata.height
                  : 1080
              }
              hex={placeholderImage.placeholder.hex}
            />
          </div>
        )}
      </div>
      <article className="prose prose-neutral prose-quoteless text-[15px] dark:prose-invert">
        <CustomMDX source={post.content} />
      </article>
    </>
  )
}

function formatDate(date: string) {
  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }

  let fullDate = new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return `${fullDate}`
}