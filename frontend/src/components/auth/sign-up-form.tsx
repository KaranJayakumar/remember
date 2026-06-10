import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { View } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { isClerkAPIResponseError, useSignUp } from '@clerk/clerk-expo';
 
export function SignUpForm() {
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState('')
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')

  const { signUp, isLoaded, setActive } = useSignUp()

  async function onSubmit() {
    if (!isLoaded || !setActive) return
    setError('')
    try{
      const signUpAttempt = await signUp.create({
        emailAddress: emailAddress,
        password : password,
      })
      if (signUpAttempt.status === 'complete') {
        await setActive({
          session: signUpAttempt.createdSessionId,
        })
        router.replace('/contacts')
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    }catch(err){
     if (isClerkAPIResponseError(err)){
       setError(err.message)
     } 
    }
  }

  return (
    <View className="w-full gap-6">
      <View className="gap-1.5 items-center">
        <Text className="text-4xl font-bold text-foreground text-center">Sign up</Text>
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
            onChangeText={(text) => setEmailAddress(text)}
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
            onChangeText={(text) => setPassword(text)}
            returnKeyType="send"
            onSubmitEditing={onSubmit}
          />
          {
            error ? (
              <Text className="text-center text-sm text-red-600">
                {error}
              </Text>
            ) : null
          }
        </View>
        <Button className="w-full" onPress={onSubmit}>
          <Text>Continue</Text>
        </Button>
      </View>
      <Text className="text-center text-sm">
        Already have an account?{' '}
        <Text
          className="text-primary underline"
          onPress={() => router.navigate('/auth/sign-in')}
        >
          Sign in
        </Text>
      </Text>
    </View>
  );
}
