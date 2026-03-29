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
    // 使用 UTC 日期避免时区问题，确保服务端和客户端计算一致
    const date = new Date(dateString)
    const today = new Date()
    // 转为 UTC 日期字符串再解析，消除时区干扰
    const dateUTC = new Date(date.toISOString().split('T')[0])
    const todayUTC = new Date(today.toISOString().split('T')[0])
    const diffDays = Math.floor((todayUTC.getTime() - dateUTC.getTime()) / 86400000)
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
        <span className="text-neutral-800 dark:text-neutral-200">{daysDisplay}d</span> <span className="opacity-30">ago</span>
      </div>
    </div>
  )
}
