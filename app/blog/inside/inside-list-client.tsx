'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Loader } from '../../components/loader-spin'

function blogPostDate(date: string) {
  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }
  const d = new Date(date)
  return `${d.getFullYear()}年${d.getMonth() + 1}月`
}

export default function InsideListClient({
  blogs,
  placeholderImageBlogMap,
}: {
  blogs
  placeholderImageBlogMap
}) {
  const [visibleBlogs, setVisibleBlogs] = useState(6)
  const observerTarget = useRef(null)
  const [loadedImages, setLoadedImages] = useState<string[]>([])

  const loadMoreBlogs = useCallback(() => {
    setTimeout(() => {
      setVisibleBlogs((prevCount) => prevCount + 6)
    }, 100)
  }, [])

  const observerCallback = useCallback(
    (entries) => {
      if (entries[0].isIntersecting && visibleBlogs < blogs.length) {
        loadMoreBlogs()
      }
    },
    [visibleBlogs, blogs.length, loadMoreBlogs]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      threshold: 1.0,
    })
    const target = observerTarget.current

    if (target) observer.observe(target)

    return () => {
      if (target) observer.unobserve(target)
    }
  }, [observerCallback])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    if (
      visibleBlogs > loadedImages.length &&
      loadedImages.length < blogs.length
    ) {
      timeoutId = setTimeout(() => {
        setLoadedImages((prevLoadedImages) => [
          ...prevLoadedImages,
          blogs[prevLoadedImages.length].slug,
        ])
      }, 100)
    }
    return () => clearTimeout(timeoutId)
  }, [visibleBlogs, blogs, loadedImages])

  return (
    <section className={clsx('mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2')}>
      {blogs.slice(0, visibleBlogs).map((post) => {
        const isLoaded = loadedImages.includes(post.slug)
        return (
          <Link
            key={post.slug}
            className="flex flex-col space-y-2"
            href={`/blog/inside/${post.slug}`}
          >
            <div className="flex w-full flex-col">
              {post.metadata.image && (
                <div
                  className={'relative rounded-xl'}
                  style={{
                    backgroundColor: placeholderImageBlogMap.get(post.slug)
                      .placeholder.hex,
                  }}
                >
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/5 dark:ring-white/5" />
                  <Image
                    alt={'Hamster1963'}
                    className={isLoaded
                      ? 'rounded-xl object-cover transition-all duration-500 ease-linear dark:brightness-75 dark:hover:brightness-100 opacity-100'
                      : 'rounded-xl object-cover opacity-0'}
                    src={post.metadata.image}
                    width={
                      placeholderImageBlogMap.get(post.slug).metadata.width
                    }
                    height={
                      placeholderImageBlogMap.get(post.slug).metadata.height
                    }
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
        )
      })}

      {visibleBlogs < blogs.length && (
        <div ref={observerTarget} className="col-span-2 mt-8 flex justify-center">
          <Loader visible={true} />
        </div>
      )}
    </section>
  )
}
