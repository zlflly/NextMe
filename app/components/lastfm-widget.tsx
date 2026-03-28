'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import NowPlayingInit from './now-playing'

type LastfmTrack = {
  title: string
  artist: string
  albumArt: string | null
  dateUts: number
} | null

// 抽离基础的 iTunes 查询逻辑
async function searchItunes(searchTerm: string) {
  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&entity=song&limit=1`,
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

// 清洗歌名：去除括号及内部内容（如 (Live版), [Remastered]），去除破折号及后面的内容
function cleanTitle(title: string) {
  return title
    .replace(/[\(（\[【].*?[\)）\]】]/g, '')
    .replace(/-.*/, '')
    .trim()
}

// 提取主歌手：按常见合作连词截断，取第一位
function extractPrimaryArtist(artist: string) {
  return artist.split(/&|feat\.|ft\.|with|、|,|，|和|\/|\\/i)[0].trim()
}

// 终极兜底策略：MusicBrainz + Cover Art Archive
async function getMusicBrainzArtwork(title: string, artist: string) {
  try {
    const query = encodeURIComponent(`recording:"${title}" AND artist:"${artist}"`)
    const mbRes = await fetch(
      `https://musicbrainz.org/ws/2/recording?query=${query}&fmt=json&limit=1`,
      {
        headers: {
          'User-Agent': 'NextMe-LastfmWidget/1.0.0 ( https://zlflly.asia/ )'
        },
        cache: 'force-cache'
      }
    )
    if (!mbRes.ok) return null
    const mbData = await mbRes.json()
    const recording = mbData.recordings?.[0]
    const releaseId = recording?.releases?.[0]?.id
    if (!releaseId) return null

    // Cover Art Archive 返回 CDN 重定向 URL（archive.org 在国内被墙），直接返回代理后的 URL
    const coverRes = await fetch(`https://coverartarchive.org/release/${releaseId}/front`)
    if (coverRes.ok && coverRes.url) {
      const proxyBase = process.env.NEXT_PUBLIC_IMAGE_PROXY_URL
      if (proxyBase) {
        return `${proxyBase}${encodeURIComponent(coverRes.url)}`
      }
      return coverRes.url
    }
    return null
  } catch {
    return null
  }
}

// 整合后的封面调度中心：Last.fm 自带 -> MusicBrainz(准确) -> iTunes 精确 -> iTunes 清洗 -> MusicBrainz原始
async function getAlbumArtwork(title: string, artist: string): Promise<string | null> {
  const clean = cleanTitle(title)
  const primaryArtist = extractPrimaryArtist(artist)

  // 策略 1：MusicBrainz 精确匹配（最准确，用于翻唱/重录版）
  // 用清洗后的歌名和主歌手，提升命中率
  let artwork = await getMusicBrainzArtwork(clean || title, primaryArtist || artist)
  if (artwork) return artwork

  // 策略 2：MusicBrainz 原始歌名+原始歌手（兜底更广的范围）
  if (clean !== title || primaryArtist !== artist) {
    artwork = await getMusicBrainzArtwork(title, artist)
    if (artwork) return artwork
  }

  // 策略 3：iTunes 精确匹配（覆盖广，速度快）
  artwork = await searchItunes(`${title} ${artist}`)
  if (artwork) return artwork

  // 策略 4：iTunes 清洗匹配（处理 Live版、合唱斜杠等）
  if (clean !== title || primaryArtist !== artist) {
    artwork = await searchItunes(`${clean} ${primaryArtist}`)
    if (artwork) return artwork
  }

  return null
}

export default function LastfmWidget({ latestPostDate }: { latestPostDate: string }) {
  const [lastfmTrack, setLastfmTrack] = useState<LastfmTrack>(null)
  const [retryDelay, setRetryDelay] = useState(0)
  // 用于去重：忽略旧请求的结果，避免竞态导致歌曲跳来跳去
  const requestIdRef = useRef(0)

  const fetchTrack = useCallback(async () => {
    const apiKey = process.env.NEXT_PUBLIC_LASTFM_API_KEY
    const username = process.env.NEXT_PUBLIC_LASTFM_USERNAME

    if (!apiKey || !username) return

    const currentRequestId = ++requestIdRef.current

    try {
      const res = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`
      )

      // 遇到速率限制，采用指数退避
      if (res.status === 429) {
        setRetryDelay((prev) => Math.min(prev === 0 ? 4000 : prev * 2, 60000))
        return
      }

      if (!res.ok) return
      const data = await res.json()
      const track = data.recenttracks?.track?.[0]
      if (!track) return

      // 成功后重置退避间隔
      setRetryDelay(0)

      const title = track.name
      const artist = track.artist?.['#text'] || track.artist
      // Last.fm 图片 CDN 不稳定（常返回 502），始终通过 iTunes/MusicBrainz 获取更可靠的封面
      const albumArt = await getAlbumArtwork(title, artist)

      // 竞态：只有最新请求的结果才更新状态
      if (currentRequestId !== requestIdRef.current) return

      setLastfmTrack({
        title,
        artist,
        albumArt,
        dateUts: track.date?.uts ? Number(track.date.uts) : Math.floor(Date.now() / 1000),
      })
    } catch {
      // silently fail
    }
  }, [])

  useEffect(() => {
    fetchTrack()
    const interval = setInterval(fetchTrack, retryDelay > 0 ? retryDelay : 2000)
    return () => clearInterval(interval)
  }, [fetchTrack, retryDelay])

  return <NowPlayingInit latestPostDate={latestPostDate} lastfmTrack={lastfmTrack} />
}
