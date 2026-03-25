/*
 * ============================================================
 * 动画说明 - 底部模糊渐变层
 * ============================================================
 *
 * 【实现原理】
 * 三个叠加的模糊渐变层，从下往上渐变遮罩：
 * 1. 位置: fixed bottom-0，左右全宽
 * 2. 高度: h-24（96px）
 * 3. 模糊: backdrop-blur-sm
 * 4. 遮罩: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)
 *    - 顶部: 透明
 *    - 底部: 白色不透明
 * 5. Z-index: 10, 20, 30 三层叠加
 *
 * 【代码级实现】
 * - 使用 CSS mask-image 实现渐变遮罩
 * - WebkitMaskImage 兼容 Safari
 * - 无 JavaScript 动画，纯 CSS 实现
 *
 * 【一致性要求】
 * 如果修改此组件，必须同步修改：
 *   - app/components/subscribe-button.tsx（如有类似模糊层）
 *   - app/components/top-commit-bar.tsx（如有类似模糊层）
 *
 * ============================================================
 */

export default function NewBlurLayer() {
  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 z-10 h-24 backdrop-blur-sm"
        style={{
          maskImage:
            'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)',
        }}
      />
      <div
        className="fixed bottom-0 left-0 right-0 z-20 h-24 backdrop-blur-sm"
        style={{
          maskImage:
            'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)',
        }}
      />
      <div
        className="fixed bottom-0 left-0 right-0 z-30 h-24 backdrop-blur-sm"
        style={{
          maskImage:
            'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)',
        }}
      />
    </>
  )
}