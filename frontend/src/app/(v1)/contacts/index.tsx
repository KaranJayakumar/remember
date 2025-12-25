import { View } from "react-native";
import { ConnectionForm } from "~/components/connection-form";
import { ContactSearchBar } from "~/components/ui/contact-search-bar";
import { useConnections } from "~/hooks/useConnections";

export default function Homepage() {
  const { createConnection, connections } = useConnections();

  const handleConnectionCreation = async (data: { name: string; tags: Record<string, string> }) => {
    await createConnection(data.name, data.tags);
  };

  const onSearch = (searchTerm : string) => {
    return
  }

  return (
    <>
      <View className="flex-1 flex-col items-center px-6 pt-16">
        <View className="w-full">
          <ContactSearchBar onChange={onSearch}/>
          <ConnectionForm onSubmit={handleConnectionCreation} />
        </View>
      </View>
    </>
  );
}
