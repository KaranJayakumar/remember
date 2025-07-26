import React, { useCallback, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useSSO } from "@clerk/clerk-expo";
import { View } from "react-native";
import { Button } from "../../components/ui/button";
import { Text } from "../../components/ui/text";
import GoogleIcon from "../../components/icons/google";
import { Platform } from "react-native";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== "web") {
      void WebBrowser.warmUpAsync();
      return () => {
        void WebBrowser.coolDownAsync();
      };
    }
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function Page() {
  useWarmUpBrowser();

  const { startSSOFlow } = useSSO();

  const onPress = useCallback(async () => {
    try {
      console.log("Pressed sign in");
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: "oauth_google",
          redirectUrl: AuthSession.makeRedirectUri(),
        });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  return (
    <View className="flex-1 justify-center items-center">
      <Button
        onPress={onPress}
        variant={"outline"}
        className="flex-row items-center justify-center"
      >
        <View className="w-6 h-6 items-center justify-center">
          <GoogleIcon />
        </View>
        <Text className="ml-2">Sign in with Google</Text>
      </Button>
    </View>
  );
}
