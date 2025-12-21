import { SocialConnections } from '@/components/auth/social-connections';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, TextInput, View } from 'react-native';
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
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Create your account</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Welcome! Please fill in the details to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
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
            <Pressable
              onPress={() => {router.navigate('/auth/sign-in')}}>
              <Text className="text-sm underline underline-offset-4">Sign in</Text>
            </Pressable>
          </Text>
          <View id='clerk-captcha'>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
