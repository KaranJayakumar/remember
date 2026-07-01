import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { SignOutButton } from "~/components/auth/sign-out-button";

export default function Settings() {
  return (
    <>
      <Text className="text-3xl font-bold text-foreground">Account</Text>
      <SignOutButton/>
    </>
  );
}
