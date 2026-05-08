import type { ReactNode } from 'react'
import Nav from './Nav'
import Footer from './Footer'

interface LayoutProps {
  children: ReactNode
  showFooter?: boolean
}

export default function Layout({ children, showFooter = true }: LayoutProps) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      {showFooter && <Footer />}
    </>
  )
}
