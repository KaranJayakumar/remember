import { UserCircle } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";

interface Props {
  id: string;
  name: string;
  imageUrl?: string | null;
  onPress?: (id: string) => void;
}

export const ConnectionPill = ({ id, name, imageUrl, onPress }: Props) => {
  return (
    <Pressable
      onPress={() => onPress?.(id)}
      className="border rounded-2xl flex flex-row items-center h-14 mb-4 active:bg-muted"
    >
      <View className="ml-2 mr-4">
        <Avatar alt="Connection Avatar">
          {imageUrl ? (
            <AvatarImage source={{ uri: imageUrl }} />
          ) : null}
          <AvatarFallback>
            <UserCircle size={20} className="text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      </View>
      <Text className="text-foreground font-medium">{name}</Text>
    </Pressable>
  );
};

