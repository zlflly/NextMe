'use client'

import { Suspense } from 'react'
import { GuestbookProvider } from '../guestbook/guestbook-context'
import Form from '../guestbook/form'
import GuestbookEntries from '../guestbook/guestbook-entry'

export default function ArticleComments({ slug }: { slug: string }) {
  return (
    <GuestbookProvider>
      <div className="mt-12 border-t border-neutral-200 pt-8 dark:border-neutral-800">
        <h2 className="mb-4 text-xl font-medium tracking-tighter">Comments</h2>
        <Form slug={slug} />
        <Suspense fallback={<div className="text-sm text-neutral-500">Loading...</div>}>
          <GuestbookEntries slug={slug} />
        </Suspense>
      </div>
    </GuestbookProvider>
  )
}
