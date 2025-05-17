import { Slot } from 'expo-router';
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import * as SplashScreen from 'expo-splash-screen';
import { resourceCache } from '@clerk/clerk-expo/resource-cache'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import "./global.css"

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient()

export default function RootLayout() {

  return (
    <ClerkProvider tokenCache={tokenCache} __experimental_resourceCache={resourceCache}>
      <QueryClientProvider client={queryClient}>
        <Slot />
      </QueryClientProvider>
    </ClerkProvider>
  )
}
