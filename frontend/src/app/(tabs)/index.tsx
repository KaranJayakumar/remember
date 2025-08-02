import { View } from "react-native";
import { useConnections } from "../../hooks/useConnections";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { createConnectionApi } from "../../api/api";
import { useState } from "react";
import { Text } from "../../components/ui/text";
import { Button } from "../../components/ui/button";
import { ConnectionForm } from "~/components/connection-form";

export default function Homepage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { connections = [] } = useConnections();
  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <View className="flex-1 flex-col items-center px-4 pt-16">
      <View className="w-full">
        <ConnectionForm
          onSubmit={(data) => console.log("Form submitted:", data)}
        />
      </View>
    </View>
  );
}
