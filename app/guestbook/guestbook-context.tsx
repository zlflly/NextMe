'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface GuestbookContextType {
  isOwner: boolean
  setIsOwner: (value: boolean) => void
  selectedReplyId: number | null
  setSelectedReplyId: (id: number | null) => void
}

const GuestbookContext = createContext<GuestbookContextType>({
  isOwner: false,
  setIsOwner: () => {},
  selectedReplyId: null,
  setSelectedReplyId: () => {},
})

export function GuestbookProvider({ children }: { children: ReactNode }) {
  const [isOwner, setIsOwner] = useState(false)
  const [selectedReplyId, setSelectedReplyId] = useState<number | null>(null)

  return (
    <GuestbookContext.Provider value={{ isOwner, setIsOwner, selectedReplyId, setSelectedReplyId }}>
      {children}
    </GuestbookContext.Provider>
  )
}

export function useGuestbook() {
  return useContext(GuestbookContext)
}
