import { useEffect, useRef } from 'react'
import './CursorEffect.css'

function CursorEffect() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const rafRef  = useRef(null)
  const pos     = useRef({ mx: -200, my: -200, rx: -200, ry: -200 })

  useEffect(() => {
    // Don't show on touch/mobile devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    const dot  = dotRef.current
    const ring = ringRef.current

    const onMouseMove = (e) => {
      pos.current.mx = e.clientX
      pos.current.my = e.clientY
      // Dot follows instantly
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      dot.style.opacity = '1'
      ring.style.opacity = '1'
    }

    // Ring follows with smooth lag
    const animateRing = () => {
      const { mx, my } = pos.current
      pos.current.rx += (mx - pos.current.rx) * 0.11
      pos.current.ry += (my - pos.current.ry) * 0.11
      ring.style.transform = `translate(${pos.current.rx}px, ${pos.current.ry}px)`
      rafRef.current = requestAnimationFrame(animateRing)
    }

    const onMouseOver = (e) => {
      if (e.target.closest('a, button, input, textarea, select, label, [role="button"]')) {
        ring.classList.add('cursor-ring--hover')
        dot.classList.add('cursor-dot--hover')
      }
    }

    const onMouseOut = (e) => {
      if (e.target.closest('a, button, input, textarea, select, label, [role="button"]')) {
        ring.classList.remove('cursor-ring--hover')
        dot.classList.remove('cursor-dot--hover')
      }
    }

    const onMouseDown = () => dot.classList.add('cursor-dot--click')
    const onMouseUp   = () => dot.classList.remove('cursor-dot--click')

    window.addEventListener('mousemove',  onMouseMove)
    document.addEventListener('mouseover',  onMouseOver)
    document.addEventListener('mouseout',   onMouseOut)
    document.addEventListener('mousedown',  onMouseDown)
    document.addEventListener('mouseup',    onMouseUp)
    rafRef.current = requestAnimationFrame(animateRing)

    return () => {
      window.removeEventListener('mousemove',  onMouseMove)
      document.removeEventListener('mouseover',  onMouseOver)
      document.removeEventListener('mouseout',   onMouseOut)
      document.removeEventListener('mousedown',  onMouseDown)
      document.removeEventListener('mouseup',    onMouseUp)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}

export default CursorEffect
