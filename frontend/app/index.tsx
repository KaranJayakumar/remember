import { useAuth } from '@clerk/clerk-expo'
import { Redirect, Stack } from 'expo-router'

export default function Page() {
  const { isSignedIn } = useAuth()

  if (!isSignedIn) {
    return <Redirect href={'/auth'} />
  }

  return (
    <Stack />
  )
}

