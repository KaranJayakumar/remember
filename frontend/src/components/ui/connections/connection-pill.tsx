import { Text, View } from "react-native"
import { Avatar, AvatarFallback, AvatarImage } from "../avatar"

interface Props{
  name : string, 
  imageUrl : string,
}
export const ConnectionPill = ({name, imageUrl} : Props) => {
  return (
    <View className="border rounded-2xl flex flex-row items-center h-14">
      <View className="ml-2 mr-4">
        <Avatar alt="Connection Avatar">
          <AvatarImage source={{ uri: imageUrl }} />
          <AvatarFallback>
            <Text>{name} avatar</Text>
          </AvatarFallback>
        </Avatar>
      </View>
      <Text>
        {name}
      </Text>
    </View>
  )
}

