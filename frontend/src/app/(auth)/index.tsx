import React, { useCallback, useEffect } from 'react'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import { useSSO } from '@clerk/clerk-expo'
import { View, Button } from 'react-native'

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession()

export default function Page() {
  useWarmUpBrowser()

  const { startSSOFlow } = useSSO()

  const onPress = useCallback(async () => {
    try {
      console.log("Pressed sign in")
      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: AuthSession.makeRedirectUri(),
      })
      console.log("Reached post")

      if (createdSessionId) {

        console.log("Created session")

        setActive!({ session: createdSessionId })
      } else {
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }, [])

  return (
    <View className="flex-1 justify-center items-center">
      <Button title="Sign in with Google" onPress={onPress} />
    </View>
  )
}
