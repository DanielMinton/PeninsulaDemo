import type { ReactNode } from 'react'
import Nav from './Nav'
import Footer from './Footer'
import LocalePicker from './LocalePicker'

interface LayoutProps {
  children: ReactNode
  showFooter?: boolean
}

export default function Layout({ children, showFooter = true }: LayoutProps) {
  return (
    <>
      <Nav />
      <LocalePicker />
      <main>{children}</main>
      {showFooter && <Footer />}
    </>
  )
}
