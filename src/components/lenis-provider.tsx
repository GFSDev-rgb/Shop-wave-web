'use client'

import { ReactLenis } from '@studio-freight/react-lenis'
import type { ReactNode } from 'react'

function LenisProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root>
      {children}
    </ReactLenis>
  )
}

export default LenisProvider
