import { useAuth } from "@clerk/clerk-expo";
import { View, Pressable, Alert } from "react-native";
import { Text } from "~/components/ui/text";
import { LogOut } from "lucide-react-native";

export default function Settings() {
  const { signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: () => signOut(),
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-background px-6 pt-16">
      <View className="w-full gap-6">
        <Text className="text-3xl font-bold text-foreground">Account</Text>

        <View className="bg-card rounded-xl border overflow-hidden">
          <Pressable
            onPress={handleSignOut}
            className="flex-row items-center justify-center py-3.5 active:bg-muted"
          >
            <LogOut size={18} className="text-red-600 mr-2" />
            <Text className="text-base font-medium text-red-600">
              Sign Out
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
