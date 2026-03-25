/* ============================================================
   统一动画规范（TopCommitBar 系列组件）
   - 入场（initial → animate）：y: 20 → 0，opacity: 0 → 1，模糊由 10px → 0
   - 退场（animate → exit）：opacity 1 → 0，原地渐隐，无位移
   - 过渡：spring 类型，duration: 0.5
   - 模糊效果：blur(10px) → blur(0px) 入场，模糊程度随 opacity 同步变化

   ⚠️ 联动说明：一旦本文件的动画规范发生变化，必须同步到以下文件：
     1. app/components/top-commit-bar.tsx
     2. app/components/top-blur-layer.tsx
   ============================================================ */

'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

export default function SubscribeButton() {
  const [showToast, setShowToast] = useState(false)

  const handleSubscribe = async () => {
    const rssUrl = `${window.location.origin}/rss`
    await navigator.clipboard.writeText(rssUrl)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <>
      <span className="mr-2 h-2 w-2 rounded-full bg-blue-500"></span>
      <button
        onClick={handleSubscribe}
        className="text-xs font-medium"
      >
        Subscribe
      </button>

      {showToast && (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2">
          <motion.div
            initial={{ y: -50, opacity: 0, filter: 'blur(10px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="flex items-center gap-2 rounded-[50px] border-[1px] border-solid bg-white px-4 py-2 shadow-xl shadow-black/5 dark:border-stone-700 dark:bg-stone-800 dark:shadow-none"
          >
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <p className="text-[12.5px] font-medium">RSS link copied</p>
          </motion.div>
        </div>
      )}
    </>
  )
}
