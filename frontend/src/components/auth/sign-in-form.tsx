import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo';
import { useState } from 'react';
 
export function SignInForm() {
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState('')
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')

  const { signIn, isLoaded, setActive } = useSignIn()

  async function onSubmit() {
    if (!isLoaded || !setActive) return
    try{
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })
      if (signInAttempt.status === 'complete') {
        await setActive({
          session: signInAttempt.createdSessionId,
        })
        router.replace('/(tabs)')
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    }catch(err){
     if (isClerkAPIResponseError(err)){
       setError(err.message)
     } 
    }
  }

  const handleSignUpNav = () => {
    router.navigate('/(auth)/sign-up')
  }
 
  return (
    <View className="w-full gap-6">
      <View className="gap-1.5 items-center">
        <Text className="text-4xl font-bold text-foreground text-center">Log in</Text>
      </View>
      <View className="gap-6">
        <View className="gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="m@example.com"
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            onChangeText={(text) => {setEmailAddress(text)}}
            returnKeyType="next"
            submitBehavior="submit"
          />
        </View>
        <View className="gap-1.5">
          <View className="flex-row items-center">
            <Label htmlFor="password">Password</Label>
          </View>
          <Input
            id="password"
            secureTextEntry
            returnKeyType="send"
            onChangeText={(text) => {setPassword(text)}}
          />
        </View>
        {
          error && (
            <Text className="text-center text-sm text-red-600">
              {error}
            </Text>
          )
        }
        <Button className="w-full" onPress={onSubmit}>
          <Text>Continue</Text>
        </Button>
        <Text className="text-center text-sm">
          Don&apos;t have an account?{' '}
          <Text
            className="text-primary underline"
            onPress={() => {
              handleSignUpNav()
            }}>
            Sign up
          </Text>
        </Text>
      </View>
    </View>
  );
}
