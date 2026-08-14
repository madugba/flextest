'use client'

import { useHomePage } from '../model/useHomePage'
import { SplashScreen } from './SplashScreen'

export function HomePage() {
  useHomePage()

  return <SplashScreen />
}
