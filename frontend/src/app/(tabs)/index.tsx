import { View } from "react-native";
import { useConnections } from "../../hooks/useConnections";
import { ConnectionForm } from "~/components/connection-form";
import { useWorkspace } from "~/hooks/useWorkspaces";

export default function Homepage() {
  const { createConnection } = useConnections();
  const {workspace} = useWorkspace()

  const handleConnectionCreation = async (data: { name: string; tags: Record<string, string> }) => {
    await createConnection(data.name, data.tags);
  };

  return (
    <View className="flex-1 flex-col items-center px-4 pt-16">
      <View className="w-full">
        <ConnectionForm onSubmit={handleConnectionCreation} />
      </View>
    </View>
  );
}
