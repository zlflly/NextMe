/**
 * Format a date string for display in blog posts
 * Used across tech, daily, and inside blog content pages
 */
export function formatDate(date: string): string {
  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }

  const fullDate = new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return `${fullDate}`
}