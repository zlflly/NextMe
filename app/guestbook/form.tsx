'use client'

import { useEffect, useState } from 'react'
import TopBlurLayer from 'app/components/top-blur-layer'
import TopCommitBar from 'app/components/top-commit-bar'
import { AnimatePresence } from 'framer-motion'
import { useGuestbook } from './guestbook-context'

export default function Form({ slug = 'guestbook' }: { slug?: string }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [entry, setEntry] = useState('')
  const [disabled, setDisabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [unsubmitted, setUnsubmitted] = useState(false)
  const { isOwner, setIsOwner, selectedReplyId, setSelectedReplyId } = useGuestbook()

  const baseUrl = process.env.NEXT_PUBLIC_GUESTBOOK_API_URL!
  const apiUrl = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}slug=${slug}`

  useEffect(() => {
    if (name || email || entry) {
      setUnsubmitted(true)
    } else {
      setUnsubmitted(false)
    }
  }, [name, email, entry])

  // Detect owner mode
  useEffect(() => {
    if (name === 'me' && email === 'me@email.com') {
      setIsOwner(true)
    } else {
      setIsOwner(false)
      // Clear selection when leaving owner mode
      setSelectedReplyId(null)
    }
  }, [name, email, setIsOwner, setSelectedReplyId])

  const handleSubmit = async () => {
    if (!name || !email || !entry) {
      alert('Please fill in all fields')
      return
    }
    setDisabled(true)
    setLoading(true)

    try {
      const body: Record<string, string> = { body: entry, created_by: name, email, slug }
      if (isOwner && selectedReplyId) {
        body.reply_to = String(selectedReplyId)
      }

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error('Failed to submit')

      setEmail('')
      setEntry('')
      setName('')
      setUnsubmitted(false)
      setSelectedReplyId(null)

      // Reload page to show new entry
      window.location.reload()
    } catch {
      alert('Failed to submit. Please try again.')
    } finally {
      setDisabled(false)
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEmail('')
    setEntry('')
    setName('')
    setSelectedReplyId(null)
  }

  return (
    <>
      <AnimatePresence>
        {unsubmitted && (
          <>
            <TopBlurLayer />
            <TopCommitBar
              handleSubmit={handleSubmit}
              handleCancel={handleCancel}
              disabled={disabled}
              loading={loading}
            />
          </>
        )}
      </AnimatePresence>
      <form className="relative">
        <section className="relative grid gap-2 md:grid-cols-2">
          <input
            aria-label="Your name"
            placeholder="Name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block rounded-lg border-neutral-300 bg-neutral-100 py-2 pl-4 text-[14px] text-neutral-900 placeholder-neutral-400 outline-none dark:bg-neutral-800 dark:text-neutral-100"
          />
          <input
            aria-label="Your email"
            placeholder="Email"
            name="email"
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block rounded-lg border-neutral-300 bg-neutral-100 py-2 pl-4 text-[14px] text-neutral-900 placeholder-neutral-400 outline-none dark:bg-neutral-800 dark:text-neutral-100"
          />
        </section>
        <textarea
          aria-label="Your message"
          placeholder="Message..."
          name="entry"
          required
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          className="mb-4 mt-2 block min-h-[80px] w-full rounded-lg border-neutral-300 bg-neutral-100 py-4 pl-4 pr-32 text-[14px] text-neutral-900 placeholder-neutral-400 outline-none dark:bg-neutral-800 dark:text-neutral-100"
        />
      </form>
    </>
  )
}
