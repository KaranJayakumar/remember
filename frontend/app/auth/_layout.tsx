import { Redirect, Slot, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import { Text, View } from 'react-native';

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Text>You are signed in!</Text>;
  }

  return <Slot />
}
