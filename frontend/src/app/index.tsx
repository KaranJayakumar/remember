import { useAuth } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'

export default function Page() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded) return

    SplashScreen.hideAsync()

    if (isSignedIn) {
      console.log("Signed in → navigating to /tabs")
      router.replace("/(tabs)")
    } else {
      console.log("Not signed in → navigating to /auth")
      router.replace("/(auth)")
    }
  }, [isLoaded, isSignedIn])

  return null
}

