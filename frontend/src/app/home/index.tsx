import { View, Text } from "react-native"

export default function Homepage() {
  console.log("Reached homepage")
  return (
    <View className="flex-1 flex-col justify-center items-center">
      <Text>
        Hello there
      </Text>
    </View>
  )
}

