'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { SkeletonBase } from '../components/skeleton-base'
import { useSearchParams } from 'next/navigation'
import { useGuestbook } from './guestbook-context'

interface GuestbookEntry {
  id: number
  body: string
  created_by: string
  created_at: string
  updated_at: string
  is_reply: number
  reply_to: number
  slug: string
  is_banner: number
  banner_url: string
  email?: string
}

export default function GuestbookEntries({ slug = 'guestbook' }: { slug?: string }) {
  const [entries, setEntries] = useState<{ guestbooks: GuestbookEntry[], replies: GuestbookEntry[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const showEmails = searchParams.get('key') === 'me'
  const { isOwner, selectedReplyId, setSelectedReplyId } = useGuestbook()

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_GUESTBOOK_API_URL!
    const apiUrl = showEmails
      ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}key=me&slug=${slug}`
      : `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}slug=${slug}`
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setEntries(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [showEmails])

  if (loading) {
    return (
      <div className="flex flex-col">
        <SkeletonBase className="h-5 w-52" />
        <SkeletonBase className="mt-5 h-5 w-52" />
        <SkeletonBase className="mt-5 h-5 w-32" />
        <SkeletonBase className="mt-5 h-5 w-32" />
        <SkeletonBase className="mt-5 h-5 w-52" />
        <SkeletonBase className="mt-5 h-5 w-52" />
        <SkeletonBase className="mt-5 h-5 w-32" />
      </div>
    )
  }

  if (!entries || entries.guestbooks.length === 0) {
    return (
      <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
        No messages yet. Be the first to leave a mark!
      </p>
    )
  }

  const { guestbooks, replies } = entries

  // Filter guestbooks that don't have a reply yet (for owner selection)
  const unrepliedGuestbooks = guestbooks.filter((g) => {
    const hasReply = replies.some((r) => r.reply_to === g.id)
    return !hasReply
  })

  return guestbooks.map((entry, index) => {
    const reply = replies.find((reply) => reply.reply_to === entry.id)
    const isUnreplied = entry.is_reply === 1 && entry.reply_to === 0 && !reply

    return (
      <motion.div
        key={entry.id}
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="mb-4 flex flex-col"
      >
        <div className="flex items-start gap-2">
          {entry.is_banner === 1 ? (
            <a
              target="_blank"
              href={entry.banner_url}
              className="rounded-lg bg-blue-700 px-2 py-1 text-xs font-semibold text-white shadow-lg shadow-blue-700/20 transition-shadow duration-300 hover:shadow-none dark:shadow-none"
            >
              {entry.body}
            </a>
          ) : (
              <div className="break-words text-sm">
                <span className="mr-1 text-neutral-600 dark:text-neutral-400">
                  {entry.created_by}:
                </span>
                {showEmails && entry.email && (
                  <span className="mr-1 text-xs text-neutral-400">({entry.email})</span>
                )}
                {entry.body}
                {isOwner && isUnreplied && (
                  <button
                    type="button"
                    onClick={() => setSelectedReplyId(selectedReplyId === entry.id ? null : entry.id)}
                    className={`ml-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-all duration-200 ${
                      selectedReplyId === entry.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-neutral-200 text-neutral-500 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-600'
                    }`}
                    aria-label={selectedReplyId === entry.id ? 'Cancel reply' : 'Select to reply'}
                  >
                    ←
                  </button>
                )}
              </div>
          )}
        </div>
        {reply && (
          <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.3 + 0.1 }}
            className="flex justify-end"
          >
            <div className="mt-3 max-w-[90%] rounded-lg bg-neutral-100 p-2 text-left text-xs text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400">
              {reply.body}
            </div>
          </motion.div>
        )}
      </motion.div>
    )
  })
}
