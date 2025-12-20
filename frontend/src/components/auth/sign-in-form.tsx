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
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { useRouter } from 'expo-router';
import { Pressable, type TextInput, View } from 'react-native';
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo';
import { useState } from 'react';
 
export function SignInForm() {
  const passwordInputRef = React.useRef<TextInput>(null);
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
        router.replace('/(tabs)/')
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
    router.navigate('/auth/sign-up')
  }
 
  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Sign in to Remember</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Welcome back! Please sign in to continue
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
                ref={passwordInputRef}
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
              <Pressable
                onPress={() => {
                  handleSignUpNav()
                }}>
                <Text className="text-sm underline underline-offset-4">Sign up</Text>
              </Pressable>
            </Text>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
