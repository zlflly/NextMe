import sharp from 'sharp'
import { promises as fs } from 'fs'
import path from 'path'
import { getPlaiceholder } from 'plaiceholder'

function bufferToBase64(buffer: Buffer): string {
  return `data:image/png;base64,${buffer.toString('base64')}`
}

function adjustDarkColor(color: { r: number; g: number; b: number; hex: string }) {
  const threshold = 30
  if (color.r < threshold && color.g < threshold && color.b < threshold) {
    return {
      r: 200,
      g: 200,
      b: 200,
      hex: '#c8c8c8',
    }
  }
  return color
}

export async function getFileBufferLocal(filepath: string) {
  const realFilepath = path.join(process.cwd(), 'public', filepath)
  return fs.readFile(realFilepath)
}

export async function getPlaceholderImage(slug: string, filepath: string) {
  try {
    const originalBuffer = await getFileBufferLocal(filepath)
    const resizedBuffer = await sharp(originalBuffer).resize(5).toBuffer()
    return {
      slug: slug,
      src: filepath,
      placeholder: bufferToBase64(resizedBuffer),
    }
  } catch {
    return {
      slug: slug,
      src: filepath,
      placeholder:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOsa2yqBwAFCAICLICSyQAAAABJRU5ErkJggg==',
    }
  }
}

export async function getPlaceholderImageFromUrl(url: string) {
  try {
    const buffer = await fetch(url).then(async (res) =>
      Buffer.from(await res.arrayBuffer())
    )
    const { base64 } = await getPlaiceholder(buffer)
    return {
      src: url,
      placeholder: base64,
    }
  } catch {
    return {
      src: url,
      placeholder:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOsa2yqBwAFCAICLICSyQAAAABJRU5ErkJggg==',
    }
  }
}

export async function getPlaceholderBlogImage(filepath: string) {
  try {
    const originalBuffer = await getFileBufferLocal(filepath)
    const { color, metadata } = await getPlaiceholder(originalBuffer)
    return {
      src: filepath,
      metadata: metadata,
      placeholder: adjustDarkColor(color),
    }
  } catch {
    return {
      src: filepath,
      placeholder: {
        r: 255,
        g: 255,
        b: 255,
        hex: '#ffffff',
      },
    }
  }
}

export async function getPlaceholderColorFromLocal(
  slug: string,
  filepath: string
) {
  try {
    const originalBuffer = await getFileBufferLocal(filepath)
    const { metadata, color } = await getPlaiceholder(originalBuffer)
    return {
      slug: slug,
      src: filepath,
      metadata: metadata,
      placeholder: adjustDarkColor(color),
    }
  } catch {
    return {
      slug: slug,
      src: filepath,
      placeholder: {
        r: 255,
        g: 255,
        b: 255,
        hex: '#ffffff',
      },
    }
  }
}

export async function getPlaceholderColorFromBlog(filepath: string) {
  try {
    const originalBuffer = await getFileBufferLocal(filepath)
    const { color } = await getPlaiceholder(originalBuffer)
    return {
      src: filepath,
      placeholder: adjustDarkColor(color),
    }
  } catch {
    return {
      src: filepath,
      placeholder: {
        r: 255,
        g: 255,
        b: 255,
        hex: '#ffffff',
      },
    }
  }
}
