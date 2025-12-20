import { useAuth } from '@clerk/clerk-expo'
import { Slot, useRouter } from 'expo-router'
import { useEffect } from 'react'

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (isSignedIn) {
      router.replace('/(tabs)')
    }
    if (isSignedIn) {
      router.replace('/(auth)/sign-in')
    }
  }, [isSignedIn])
  return <Slot />
}
