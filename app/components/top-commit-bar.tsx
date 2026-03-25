/* ============================================================
   统一动画规范（TopCommitBar 系列组件）
   - 入场（initial → animate）：y: 20 → 0，opacity: 0 → 1，模糊由 10px → 0
   - 退场（animate → exit）：opacity 1 → 0，原地渐隐，无位移
   - 过渡：spring 类型，duration: 0.5
   - 模糊效果：blur(10px) → blur(0px) 入场，模糊程度随 opacity 同步变化

   ⚠️ 联动说明：一旦本文件的动画规范发生变化，必须同步到以下文件：
     1. app/components/subscribe-button.tsx
     2. app/components/top-blur-layer.tsx
   ============================================================ */

'use client'

import { motion } from 'framer-motion'
import { Disc } from 'lucide-react'
import { LoadingSpinner } from './loader-spin'

type TopCommitBarProps = {
  handleSubmit: () => Promise<void>
  handleCancel: () => void
  disabled: boolean
  loading: boolean
}

export default function TopCommitBar({
  handleSubmit,
  handleCancel,
  disabled,
  loading,
}: TopCommitBarProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        initial={{ y: -50, opacity: 0, filter: 'blur(10px)' }}
        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="fixed top-4 z-50 flex items-center justify-between gap-4 rounded-[50px] border-[1px] border-solid bg-white px-2 py-1.5 shadow-xl shadow-black/5 dark:border-stone-700 dark:bg-stone-800 dark:shadow-none"
      >
        <section className="flex items-center gap-1.5">
          <Disc className="h-4 w-4 flex-shrink-0" />
          <p className="text-[12.5px] font-medium">Uncommitted comments</p>
        </section>
        <section className="flex items-center gap-1.5">
          <button
            className="rounded-full border-[1px] border-stone-200 bg-transparent px-2 py-1 text-xs font-medium text-black transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-white dark:hover:bg-stone-700"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            disabled={disabled}
            className="rounded-full bg-black px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-stone-700 dark:bg-stone-600"
            onClick={handleSubmit}
          >
            {loading ? <LoadingSpinner /> : 'Submit'}
          </button>
        </section>
      </motion.div>
    </div>
  )
}
