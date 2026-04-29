'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import type { ReactNode } from 'react'

interface FadeInProps {
  children: ReactNode
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  className?: string
  once?: boolean
}

const OFFSETS = {
  up: { y: 32, x: 0 },
  down: { y: -32, x: 0 },
  left: { y: 0, x: 32 },
  right: { y: 0, x: -32 },
  none: { y: 0, x: 0 },
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  direction = 'up',
  className = '',
  once = true,
}: FadeInProps) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: once })
  const { x, y } = OFFSETS[direction]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x, y }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
