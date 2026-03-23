'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import NowPlayingStatus from './now-playing-status'

export default function NowPlayingInit({ latestPostDate }: { latestPostDate: string }) {
  // Favorite song data
  const favoriteSong = {
    title: 'Red Bean',
    artist: 'Khalil Fong',
    albumArt: 'https://pub-85fe3948f0644e2cba137d74f3630b8b.r2.dev/IMG_4040.jpeg'
  }

  return (
    <div style={{ position: 'relative', minHeight: '100px' }}>
      <AnimatePresence>
        <motion.div
          key="nowPlaying"
          style={{
            position: 'absolute',
            width: '100%',
            animation: 'blurFadeIn 0.8s forwards',
          }}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          <NowPlaying favoriteSong={favoriteSong} latestPostDate={latestPostDate} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function NowPlaying({ favoriteSong, latestPostDate }: { favoriteSong: { title: string, artist: string, albumArt: string }, latestPostDate: string }) {
  return (
    <div className="flex flex-col gap-y-1 rounded-[10px] bg-neutral-200/40 p-1 dark:bg-neutral-700/50">
      <div className="relative flex w-full rounded-md border-[0.5px] border-neutral-200 bg-white/80 p-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-none dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-none">
        <div className="flex gap-x-2">
          <div className="relative h-12 w-12 rounded-[3px] bg-neutral-200 dark:bg-neutral-800">
            <img
              src={favoriteSong.albumArt}
              width={50}
              height={50}
              className="h-12 w-12 rounded-[3px] object-cover"
              alt={favoriteSong.title}
            />
          </div>
          <div className="flex flex-col justify-between py-1">
            <div className="flex items-center gap-1.5 text-sm font-medium">
              {favoriteSong.title}
            </div>
            <div className="text-xs opacity-30">{favoriteSong.artist}</div>
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
