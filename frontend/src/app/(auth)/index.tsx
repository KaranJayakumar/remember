import React, { useCallback, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useSSO } from "@clerk/clerk-expo";
import { View } from "react-native";
import { Button } from "../../components/ui/button";
import { Text } from "../../components/ui/text";
import { Platform } from "react-native";
import { Image } from "expo-image";

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
  const googleLogoPath = require("../../assets/svg/google-main-icon.svg");

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
        <Image source={googleLogoPath} width={24} height={24} />
        <Text className="ml-2">Sign in with Google</Text>
      </Button>
    </View>
  );
}
