import { Pressable, Text, View } from "react-native";
import { ProfileImage } from "~/components/ui/profile-image";

interface Props {
  id: string;
  name: string;
  image_url?: string | null;
  onPress?: (id: string) => void;
}

export const ConnectionPill = ({ id, name, image_url, onPress }: Props) => {
  return (
    <Pressable
      onPress={() => onPress?.(id)}
      className="border rounded-2xl flex flex-row items-center h-14 mb-4 active:bg-muted"
    >
      <View className="ml-2 mr-4">
        <ProfileImage imageUri={image_url} size={40} />
      </View>
      <Text className="text-foreground font-medium">{name}</Text>
    </Pressable>
  );
};

