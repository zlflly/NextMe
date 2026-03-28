'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import NowPlayingStatus from './now-playing-status'

function NowPlayingLoading() {
  return (
    <div className="flex flex-col gap-y-1 rounded-[10px] bg-neutral-200/40 p-1 dark:bg-neutral-700/50">
      <div className="flex w-full justify-between rounded-md border-[0.5px] border-neutral-200 bg-white/80 p-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-none dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-none">
        <div className="flex gap-x-2">
          <div className="h-12 w-12 rounded-[3px] bg-neutral-200 dark:bg-neutral-800" />
          <div className="flex flex-col justify-between py-1.5">
            <div className="h-4 w-24 rounded-[3px] bg-neutral-100 dark:bg-neutral-800" />
            <div className="h-3 w-10 rounded-[3px] bg-neutral-100 dark:bg-neutral-800" />
          </div>
        </div>
        <div className="flex flex-col justify-end"></div>
      </div>
      <div className={'flex h-6 items-center justify-between'}>
        <div className="flex flex-row items-center gap-x-1.5 pl-1">
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex h-2 w-2 rounded-full bg-neutral-200 dark:bg-neutral-700"></span>
          </span>
          <div className="h-2 w-36 rounded-md bg-neutral-200 dark:bg-neutral-700" />
        </div>
        <div className="mr-1 h-2 w-9 rounded-md bg-neutral-200 dark:bg-neutral-700" />
      </div>
    </div>
  )
}

function getTimeAgo(uts: number) {
  const diff = Math.floor(Date.now() / 1000) - uts
  if (diff < 60) return { label: 'now', isNow: true }
  if (diff < 3600) return { label: `${Math.floor(diff / 60)}m ago`, isNow: false }
  if (diff < 86400) return { label: `${Math.floor(diff / 3600)}h ago`, isNow: false }
  return { label: `${Math.floor(diff / 86400)}d ago`, isNow: false }
}

export default function NowPlayingInit({ latestPostDate, lastfmTrack }: { latestPostDate: string; lastfmTrack: { title: string; artist: string; albumArt: string | null; dateUts: number | null } | null }) {
  const [displayedTrack, setDisplayedTrack] = useState(lastfmTrack)
  const [isImageReady, setIsImageReady] = useState(false)

  useEffect(() => {
    if (!lastfmTrack) return

    // 新歌曲来了，先显示旧数据（如果有的话），开始预加载新图片
    const img = new Image()
    img.src = getProxyImageUrl(lastfmTrack.albumArt)

    img.onload = () => {
      setIsImageReady(true)
      setDisplayedTrack(lastfmTrack)
    }

    img.onerror = () => {
      // 图片加载失败也切换，避免卡住
      setIsImageReady(true)
      setDisplayedTrack(lastfmTrack)
    }

    // 如果没有正在显示的内容（首次加载），直接显示
    if (!displayedTrack) {
      setIsImageReady(true)
      setDisplayedTrack(lastfmTrack)
    }
  }, [lastfmTrack])

  return (
    <div style={{ position: 'relative', minHeight: '100px' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={displayedTrack ? `${displayedTrack.title}-${displayedTrack.artist}` : 'loading'}
          style={{
            position: 'absolute',
            width: '100%',
            animation: 'blurFadeIn 0.8s forwards',
          }}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          {displayedTrack ? (
            <NowPlaying favoriteSong={displayedTrack} latestPostDate={latestPostDate} />
          ) : (
            <NowPlayingLoading />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function getProxyImageUrl(coverUrl: string | null): string {
  if (!coverUrl) return '/place.webp'
  const proxyBase = process.env.NEXT_PUBLIC_IMAGE_PROXY_URL
  if (!proxyBase) return coverUrl
  // 避免双重编码：如果已经是代理 URL 则直接返回
  if (coverUrl.startsWith(proxyBase)) return coverUrl
  return `${proxyBase}${encodeURIComponent(coverUrl)}`
}

function NowPlaying({ favoriteSong, latestPostDate }: { favoriteSong: { title: string; artist: string; albumArt: string | null; dateUts: number | null }; latestPostDate: string }) {
  const timeAgo = favoriteSong.dateUts ? getTimeAgo(favoriteSong.dateUts) : null
  const trackKey = `${favoriteSong.title}-${favoriteSong.artist}`

  return (
    <div className="flex flex-col gap-y-1 rounded-[10px] bg-neutral-200/40 p-1 dark:bg-neutral-700/50">
      <div className="relative flex w-full rounded-md border-[0.5px] border-neutral-200 bg-white/80 p-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-none dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-none">
        <div className="flex gap-x-2">
          <motion.div
            key={`art-${trackKey}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="relative h-12 w-12 rounded-[3px] bg-neutral-200 dark:bg-neutral-800"
          >
            <img
              src={getProxyImageUrl(favoriteSong.albumArt)}
              width={50}
              height={50}
              className="h-12 w-12 rounded-[3px] object-cover"
              alt={favoriteSong.title}
              onError={(e) => { e.currentTarget.src = '/place.webp' }}
            />
          </motion.div>
          <div className="flex flex-col justify-between py-1">
            <motion.div
              key={`title-${trackKey}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-1.5 text-sm font-medium"
            >
              {favoriteSong.title}
              {timeAgo && (
                <span className={`rounded-sm bg-neutral-100 px-1 py-0 text-[10px] font-normal dark:bg-neutral-800 ${timeAgo.isNow ? 'text-green-500 dark:text-green-400' : 'text-neutral-500 dark:text-neutral-500'}`}>
                  {timeAgo.label}
                </span>
              )}
            </motion.div>
            <motion.div
              key={`artist-${trackKey}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="text-xs opacity-30"
            >
              {favoriteSong.artist}
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-2 right-2 flex flex-col justify-end">
          <div className="flex flex-row items-center gap-x-1.5">
            <p className="text-[10px] opacity-30">Sync with</p>
            <div className="w-3 h-3 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#F62626">
                <path d="M10.421 11.375c-.294 1.028.012 2.064.784 2.653 1.061.81 2.565.3 2.874-.995.08-.337.103-.722.027-1.056-.23-1.001-.52-1.988-.792-2.996-1.33.154-2.543 1.172-2.893 2.394zm5.548-.287c.273 1.012.285 2.017-.127 3-1.128 2.69-4.721 3.14-6.573.826-1.302-1.627-1.28-3.961.06-5.734.78-1.032 1.804-1.707 3.048-2.054l.379-.104c-.084-.415-.188-.816-.243-1.224-.176-1.317.512-2.503 1.744-3.04 1.226-.535 2.708-.216 3.53.76.406.479.395 1.08-.025 1.464-.412.377-.996.346-1.435-.09-.247-.246-.51-.44-.877-.436-.525.006-.987.418-.945.937.037.468.173.93.3 1.386.022.078.216.135.338.153 1.334.197 2.504.731 3.472 1.676 2.558 2.493 2.861 6.531.672 9.44-1.529 2.032-3.61 3.168-6.127 3.409-4.621.44-8.664-2.53-9.7-7.058C2.515 10.255 4.84 5.831 8.795 4.25c.586-.234 1.143-.031 1.371.498.232.537-.019 1.086-.61 1.35-2.368 1.06-3.817 2.855-4.215 5.424-.533 3.433 1.656 6.776 5 7.72 2.723.77 5.658-.166 7.308-2.33 1.586-2.08 1.4-5.099-.427-6.873a3.979 3.979 0 0 0-1.823-1.013c.198.716.389 1.388.57 2.062z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <NowPlayingStatus latestPostDate={latestPostDate} />
    </div>
  )
}
