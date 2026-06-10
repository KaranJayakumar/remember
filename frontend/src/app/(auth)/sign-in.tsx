import React, { useCallback, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useSSO } from "@clerk/clerk-expo";
import { View } from "react-native";
import { Platform } from "react-native";
import { SignInForm } from "~/components/auth/sign-in-form";
import Logo from "~/components/auth/logo";

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
  return (
    <View className="flex-1 bg-slate-50 justify-center items-center px-4">
      <Logo />
      <SignInForm/>
    </View>
  );
}
