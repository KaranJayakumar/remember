import { View } from "react-native";
import { ConnectionForm } from "~/components/connection-form";
import { ConnectionPill } from "~/components/ui/connections/connection-pill";
import { ContactSearchBar } from "~/components/ui/contact-search-bar";
import { useConnections } from "~/hooks/useConnections";
import { Connection } from "~/types/connections";

const mockConnections : Connection []= [{
  id : 'asdjflkjl', 
  name : 'Janine', 
  imageUrl : 'https://i.pravatar.cc/300'
}]
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
          <View className="mt-4">
            {
              mockConnections.map((connection, index) => {
                return (
                  <ConnectionPill key={index} name={connection.name} imageUrl={connection.imageUrl}/>
                )
              })
            }
          </View>
        </View>
      </View>
    </>
  );
}
