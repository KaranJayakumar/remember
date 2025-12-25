import { useAuth } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'

export default function Page() {
  const { isSignedIn, isLoaded } = useAuth()
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  })

  useEffect(() => {
    if (!isLoaded || !isMounted) return

    SplashScreen.hideAsync()

    if (isSignedIn) {
      console.log("Signed in → navigating to /tabs")
      router.replace("/(v1)/contacts")
    } else {
      console.log("Not signed in → navigating to /auth")
      router.replace("/auth")
    }
  }, [isLoaded, isSignedIn])

  return null
}


