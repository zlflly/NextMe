'use client'

import { useEffect, useState } from 'react'

export default function NowPlayingStatus({ latestPostDate }: { latestPostDate: string }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient)
    return (
      <div className={'flex h-6 items-center justify-between'}>
        <div className="flex flex-row items-center gap-x-1.5 pl-1">
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex h-2 w-2 rounded-full bg-neutral-200 dark:bg-neutral-700"></span>
          </span>
          <div className="h-2 w-36 rounded-md bg-neutral-200 dark:bg-neutral-700" />
        </div>
        <div className="mr-1 h-2 w-9 rounded-md bg-neutral-200 dark:bg-neutral-700" />
      </div>
    )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const isToday = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const getDaysSinceUpdate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysSinceUpdate = getDaysSinceUpdate(latestPostDate)
  const today = isToday(latestPostDate)
  const displayDate = today ? 'today' : formatDate(latestPostDate)
  const textColorClass = today ? 'text-green-500' : 'opacity-30'
  const daysDisplay = today ? 0 : daysSinceUpdate

  return (
    <div className={'flex h-6 items-center justify-between'}>
      <div className="flex flex-row items-center gap-x-1.5 pl-1">
        <span className="relative flex h-2 w-2">
          <span
            className={`relative inline-flex h-2 w-2 rounded-full ${today ? 'bg-green-500' : 'bg-neutral-200 dark:bg-neutral-700'}`}
          ></span>
        </span>
        <div className={`text-xs ${textColorClass}`}>
          Last updated on {displayDate}
        </div>
      </div>

      <div className="mr-1 text-[11px] font-semibold">
        <span className="text-white">{daysDisplay}d</span> <span className="opacity-30">ago</span>
      </div>
    </div>
  )
}
