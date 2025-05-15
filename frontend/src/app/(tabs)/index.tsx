import { View, Text } from "react-native"
import { useConnections } from "../../hooks/useConnections"

export default function Homepage() {
  const { connections = [] } = useConnections()
  return (
    <View className="flex-1 flex-col justify-center items-center">
      {connections.map((conn: any) => (
        <View key={conn.id} className="mb-4 p-4 bg-gray-100 rounded">
          <Text className="text-lg font-semibold">{conn.name}</Text>
          <Text className="text-sm text-gray-600">User ID: {conn.parentUserId}</Text>
        </View>
      ))}
      <Text>
        Hello there
      </Text>
    </View>
  )
}

