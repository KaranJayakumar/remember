import { Camera } from "lucide-react-native";
import { Alert, Pressable, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Text } from "~/components/ui/text";
import { ProfileImage } from "~/components/ui/profile-image";

interface ChooseProfileImageProps {
  imageUri?: string | null;
  onImageSelected: (uri: string | null) => void;
  size?: number;
}

export function ChooseProfileImage({
  imageUri,
  onImageSelected,
  size = 96,
}: ChooseProfileImageProps) {
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Please allow access to your photo library to upload a profile picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      onImageSelected(result.assets[0].uri);
    }
  };

  return (
    <View className="items-center">
      <Pressable
        onPress={pickImage}
        className="rounded-full active:opacity-80"
        style={{ width: size, height: size }}
      >
        <ProfileImage imageUri={imageUri} size={size} />
      </Pressable>
      <View className="flex-row items-center gap-2 mt-3">
        <Camera size={16} className="text-muted-foreground" />
        <Text className="text-muted-foreground text-sm">
          {imageUri ? "Change photo" : "Add photo"}
        </Text>
      </View>
    </View>
  );
}
