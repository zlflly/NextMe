'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function AnimatedAmbient() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="pointer-events-none fixed inset-x-0 top-0 z-0 flex h-screen items-start justify-center overflow-hidden select-none"
        >
          {/* 在这里控制明暗主题的透明度和混合模式 */}
          <div className="absolute -top-52 right-0 left-0 flex h-[300px] items-center justify-center mix-blend-normal opacity-50 blur-[80px] saturate-150 transition-opacity duration-1000 dark:mix-blend-screen dark:opacity-20">
            <div className="animate-orbit absolute h-[500px] w-[500px]">
              <div className="absolute top-[125px] left-[125px] w-[250px] rounded-full bg-sky-500 pb-[250px]"></div>
            </div>
            <div className="animate-orbit2 absolute h-[250px] w-[500px]">
              <div className="absolute top-[50px] left-[125px] w-[200px] rounded-full bg-fuchsia-500 pb-[200px]"></div>
            </div>
            <div className="animate-orbit3 absolute h-[500px] w-[500px]">
              <div className="absolute top-[250px] left-[150px] w-[150px] rounded-full bg-cyan-400 pb-[150px]"></div>
            </div>
            <div className="animate-orbit4 absolute h-[500px] w-[250px]">
              <div className="absolute top-[125px] left-[62.5px] w-[150px] rounded-full bg-green-400 pb-[150px]"></div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}