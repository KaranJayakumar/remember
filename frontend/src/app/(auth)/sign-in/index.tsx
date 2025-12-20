import React, { useCallback, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useSSO } from "@clerk/clerk-expo";
import { View } from "react-native";
import { Platform } from "react-native";
import { SignInForm } from "~/components/auth/sign-in-form";

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
  const googleLogoPath = require("../../../assets/svg/google-main-icon.svg");

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
      <SignInForm/>
    </View>
  );
}

