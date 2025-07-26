import { View } from "react-native";
import { useConnections } from "../../hooks/useConnections";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { createConnectionApi } from "../../api/api";
import { useState } from "react";
import { Text } from "../../components/ui/text";
import { Button } from "../../components/ui/button";

export default function Homepage() {
  const { connections = [] } = useConnections();
  const { getToken } = useAuth();
  const [name] = useState("My New Connection"); // Example static name

  const createConnection = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("Missing token");
      return createConnectionApi(token, name);
    },
  });

  return (
    <View className="flex-1 flex-col justify-center items-center">
      {connections.map((conn: any) => (
        <View key={conn.id} className="mb-4 p-4 bg-gray-100 rounded">
          <Text className="text-lg font-semibold">{conn.name}</Text>
          <Text className="text-sm text-gray-600">
            User ID: {conn.parentUserId}
          </Text>
        </View>
      ))}

      <Text className="mb-4">Hello there, welcome to remember</Text>
      <Button
        variant={"default"}
        className="flex-row items-center justify-center"
      >
        <Text>Create a Connection</Text>
      </Button>
    </View>
  );
}
