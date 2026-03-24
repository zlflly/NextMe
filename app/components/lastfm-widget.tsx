'use client'

import { useEffect, useState } from 'react'
import NowPlayingInit from './now-playing'

type LastfmTrack = {
  title: string
  artist: string
  albumArt: string
  dateUts: number
} | null

async function getItunesArtwork(title: string, artist: string) {
  try {
    const term = encodeURIComponent(`${title} ${artist}`)
    const res = await fetch(
      `https://itunes.apple.com/search?term=${term}&entity=song&limit=1`,
      { cache: 'force-cache' }
    )
    if (!res.ok) return null
    const data = await res.json()
    const artwork = data.results?.[0]?.artworkUrl100
    if (!artwork) return null
    return artwork.replace('100x100', '600x600')
  } catch {
    return null
  }
}

export default function LastfmWidget({ latestPostDate }: { latestPostDate: string }) {
  const [lastfmTrack, setLastfmTrack] = useState<LastfmTrack>(null)

  useEffect(() => {
    async function fetchTrack() {
      const apiKey = process.env.NEXT_PUBLIC_LASTFM_API_KEY
      const username = process.env.NEXT_PUBLIC_LASTFM_USERNAME

      if (!apiKey || !username) return

      try {
        const res = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`
        )
        if (!res.ok) return
        const data = await res.json()
        const track = data.recenttracks?.track?.[0]
        if (!track) return

        const title = track.name
        const artist = track.artist?.['#text'] || track.artist
        const lastfmArt = track.image?.[3]?.['#text'] || track.image?.[2]?.['#text'] || null
        const albumArt = lastfmArt || (await getItunesArtwork(title, artist)) || null

        setLastfmTrack({
          title,
          artist,
          albumArt,
          dateUts: track.date?.uts ? Number(track.date.uts) : Math.floor(Date.now() / 1000),
        })
      } catch {
        // silently fail
      }
    }

    fetchTrack()
  }, [])

  return <NowPlayingInit latestPostDate={latestPostDate} lastfmTrack={lastfmTrack} />
}
