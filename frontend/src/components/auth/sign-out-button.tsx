import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { Text } from 'react-native'
import { Button } from '../ui/button'

export const SignOutButton = () => {
  const { signOut } = useClerk()

  const handleSignOut = async () => {
    try {
      await signOut()
      Linking.openURL(Linking.createURL('/'))
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <Button onPress={handleSignOut}>
      <Text>Sign Out</Text>
    </Button>
  )
}
