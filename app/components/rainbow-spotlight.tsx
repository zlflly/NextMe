'use client'

import { useEffect, useState } from 'react'

export default function RainbowSpotlight() {
  const [show, setShow] = useState(false)
 
  useEffect(() => {
    // 页面加载完成后触发光束展开动画
    const timer = setTimeout(() => setShow(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-0 flex h-[500px] select-none justify-center overflow-hidden">
      <div
        className={`absolute -top-24 w-full max-w-screen-lg origin-top transition-all duration-1000 ease-out ${
          show ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
      >
        {/* 彩虹环境光晕层 */}
        <div className="absolute inset-x-0 top-0 h-[300px] w-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 opacity-40 blur-[100px] mix-blend-normal dark:opacity-20 dark:mix-blend-screen" />
        
        {/* 中心高亮聚光束层 */}
        <div className="absolute inset-x-0 top-0 left-1/2 h-[400px] w-[60%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top_center,rgba(255,255,255,0.6)_0%,transparent_80%)] blur-[50px] dark:bg-[radial-gradient(ellipse_at_top_center,rgba(255,255,255,0.15)_0%,transparent_80%)]" />
      </div>
    </div>
  )
}