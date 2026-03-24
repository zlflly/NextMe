import Image from 'next/image'
import avatar from 'app/avatar.webp'
import campus from 'public/main/campus.webp'
import desktop from 'public/main/desktop.webp'
import leave_dalian from 'public/main/leave_dalian.webp'
import xinjiang from 'public/main/xinjiang.webp'
import Link from 'next/link'
import { GitHubIcon } from './components/Icon'
import NowPlayingInit from './components/now-playing'
import { getBlogPosts } from './db/blog'

async function getItunesArtwork(title: string, artist: string) {
  try {
    const term = encodeURIComponent(`${title} ${artist}`)
    const res = await fetch(
      `https://itunes.apple.com/search?term=${term}&entity=song&limit=1`,
      { next: { revalidate: 86400 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    const artwork = data.results?.[0]?.artworkUrl100
    if (!artwork) return null
    // Convert 100x100 to 600x600 for higher quality
    return artwork.replace('100x100', '600x600')
  } catch {
    return null
  }
}

async function getLastfmTrack() {
  const username = process.env.LASTFM_USERNAME
  const apiKey = process.env.LASTFM_API_KEY

  if (!username || !apiKey) return null

  try {
    const res = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`,
      { next: { revalidate: 30 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    const track = data.recenttracks?.track?.[0]
    if (!track) return null

    const title = track.name
    const artist = track.artist?.['#text'] || track.artist
    const lastfmArt = track.image?.[3]?.['#text'] || track.image?.[2]?.['#text'] || null

    // Fallback to iTunes if Last.fm has no artwork
    const albumArt = lastfmArt || (await getItunesArtwork(title, artist)) || null

    return { title, artist, albumArt }
  } catch {
    return null
  }
}

export default async function Page() {
  const blogPosts = getBlogPosts()
  const latestPost = blogPosts.reduce((latest, post) => {
    const postDate = new Date(post.metadata.publishedAt)
    const latestDate = new Date(latest.metadata.publishedAt)
    return postDate > latestDate ? post : latest
  })

  const lastfmTrack = await getLastfmTrack()

  return (
    <section>
      <section className="sm:px-28 sm:pt-8">
        <Image
          alt={'zlflly2005'}
          src={avatar}
          height={64}
          width={64}
          sizes="33vw"
          placeholder="blur"
          className="mb-6 h-14 w-14 rounded-full border border-neutral-200 dark:border-neutral-700"
          priority
        />
        <h1 className="mb-1 text-xl font-medium tracking-tighter">
          zlflly2005
        </h1>
        <p className="prose prose-neutral text-sm dark:prose-invert">
          Student, amateur researcher.
        </p>
        <p className={'mb-6 pt-10 text-lg font-medium tracking-tight'}>
          👋 Hi, I'm zlflly2005.
          <br />
          Loves writing code and doing research.
          <br />
          I will share some tech related things and my ideas here.
          <br />
        </p>
        <NowPlayingInit latestPostDate={latestPost.metadata.publishedAt} lastfmTrack={lastfmTrack} />
        <div className={'mt-6 flex items-center'}>
          <Link href="https://github.com/zlflly" target="_blank">
            <button
              className={
                'mr-4 flex items-center justify-center rounded-xl border-[0.5px] border-neutral-200 p-2 text-xs font-medium shadow-[0_2px_2px_rgba(0,0,0,0.04)] transition-all duration-300 hover:bg-stone-100 hover:shadow-none dark:border-neutral-700 dark:bg-neutral-700/20 dark:hover:bg-neutral-900/20'
              }
            >
              <GitHubIcon className="mr-1 h-4" />
              <p>GitHub</p>
            </button>
          </Link>
          <span className="mr-2 h-2 w-2 rounded-full bg-blue-500"></span>
          <Link
            href={'https://home.buycoffee.top'}
            target="_blank"
            className="text-xs font-medium"
          >
            Monitor
          </Link>
          <p className="mx-1 text-xs font-medium">/</p>
          <Link
            href={'https://changelog.buycoffee.top'}
            target="_blank"
            className="text-xs font-medium"
          >
            Changelog
          </Link>
        </div>
      </section>
      <Photos />
    </section>
  )
}

function Photos() {
  const photo_1 = campus
  const photo_2 = desktop
  const photo_3 = leave_dalian
  const photo_4 = xinjiang
  return (
    <section
      className={
        '-mx-6 overflow-scroll sm:mx-0 sm:flex sm:flex-row sm:justify-center md:overflow-visible'
      }
    >
      <section className={'relative h-[460px] w-[800px]'}>
        <div
          style={{
            transform:
              'perspective(1200px) translateX(0px) translateY(0px) scale(1) rotate(-4deg) rotateX(0deg) rotateY(0deg) skewX(0deg) skewY(0deg) translateZ(0px)',
            position: 'absolute',
            left: 'calc(17.75% - 109px)',
            top: 'calc(48.913% - 138px)',
          }}
          className={
            'transform-none-on-hover h-[276px] w-[218px] cursor-pointer rounded-lg border-[8px] border-white shadow-md transition-all duration-300 hover:shadow-xl'
          }
        >
          <Image
            alt={'photo_1'}
            src={photo_1}
            placeholder="blur"
            fill
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div
          style={{
            transform:
              'perspective(1200px) translateX(0px) translateY(0px) scale(1) rotate(1deg) rotateX(0deg) rotateY(0deg) skewX(0deg) skewY(0deg) translateZ(0px)',
            position: 'absolute',
            left: 'calc(40% - 109px)',
            top: 'calc(58% - 138px)',
          }}
          className={
            'transform-none-on-hover h-[276px] w-[218px] cursor-pointer rounded-lg border-[8px] border-white shadow-md transition-all duration-300 hover:shadow-xl'
          }
        >
          <Image
            alt={'photo_2'}
            src={photo_2}
            placeholder="blur"
            fill
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div
          style={{
            transform:
              'perspective(1200px) translateX(0px) translateY(0px) scale(1) rotate(0deg) rotateX(0deg) rotateY(0deg) skewX(0deg) skewY(0deg) translateZ(0px)',
            position: 'absolute',
            left: 'calc(64% - 109px)',
            top: 'calc(38% - 138px)',
          }}
          className={
            'transform-none-on-hover h-[276px] w-[218px] cursor-pointer rounded-lg border-[8px] border-white shadow-md transition-all duration-300 hover:shadow-xl'
          }
        >
          <Image
            alt={'photo_3'}
            src={photo_3}
            placeholder="blur"
            fill
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div
          style={{
            transform:
              'perspective(1200px) translateX(0px) translateY(0px) scale(1) rotate(-2deg) rotateX(0deg) rotateY(0deg) skewX(0deg) skewY(0deg) translateZ(0px)',
            position: 'absolute',
            left: 'calc(83% - 109px)',
            top: 'calc(55% - 138px)',
          }}
          className={
            'transform-none-on-hover h-[276px] w-[218px] cursor-pointer rounded-lg border-[8px] border-white shadow-md transition-all duration-300 hover:shadow-xl'
          }
        >
          <Image
            alt={'photo_4'}
            src={photo_4}
            placeholder="blur"
            fill
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </section>
    </section>
  )
}
