import { CircleUser } from "lucide-react-native";
import { Text, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
export default function AddConnection() {
  return (
    <>
      <View className="flex-1 flex-col items-center px-6 pt-16">
        <CircleUser height={100} width={100} />
      </View>
    </>
  );
}



