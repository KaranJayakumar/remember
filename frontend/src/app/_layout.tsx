import { Slot, Stack } from "expo-router";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import * as SplashScreen from "expo-splash-screen";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./global.css";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <>
      <ClerkProvider tokenCache={tokenCache}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <SafeAreaView className='flex-1'>
              <Stack screenOptions={{ headerShown: false }}>
                <SignedIn>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </SignedIn>
                <SignedOut>
                  <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                </SignedOut>
              </Stack>
            </SafeAreaView>
          </SafeAreaProvider>
        </QueryClientProvider>
      </ClerkProvider>
      <PortalHost />
    </>
  );
}
