import { Slot } from 'expo-router';
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import * as SplashScreen from 'expo-splash-screen';
import "./global.css"

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  console.log("Reached root layout")
  SplashScreen.hideAsync();

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <Slot />
    </ClerkProvider>
  )
}
