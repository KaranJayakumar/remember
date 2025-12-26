import { useAuth } from '@clerk/clerk-expo'
import { Slot, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { useRootNavigationState } from 'expo-router'

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const rootNavigationState = useRootNavigationState()
  const navigatorReady = rootNavigationState?.key != null

  useEffect(() => {
    if (!navigatorReady){
      return
    }
    if (isSignedIn) {
      router.replace('/(tabs)')
    }
    if (!isSignedIn) {
      router.replace('/auth/sign-in')
    }
  }, [isSignedIn, navigatorReady])

  return <Slot />
}
