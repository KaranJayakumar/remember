import { Pressable, Text, View } from "react-native";
import { ProfileImage } from "~/components/ui/profile-image";

interface Props {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string | null;
  onPress?: (id: string) => void;
}

export const ConnectionPill = ({ id, first_name, last_name, image_url, onPress }: Props) => {
  const displayName = `${first_name} ${last_name}`.trim();
  return (
    <Pressable
      onPress={() => onPress?.(id)}
      className="rounded-2xl flex flex-row items-center h-24 mb-4 active:bg-muted"
    >
      <View className="ml-2 mr-4">
        <ProfileImage imageUri={image_url} size={60} />
      </View>
      <Text className="text-foreground font-medium">{displayName}</Text>
    </Pressable>
  );
};
