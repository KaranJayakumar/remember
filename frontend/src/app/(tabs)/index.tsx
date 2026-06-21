import { useEffect, useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { ConnectionPill } from "~/components/ui/connections/connection-pill";
import { ContactSearchBar } from "~/components/ui/contact-search-bar";
import { useConnections } from "~/hooks/useConnections";
import { Connection } from "~/types/connections";

export default function Homepage() {
  const router = useRouter();
  const { connections } = useConnections();
  const [filteredConnections, setFilteredConnections] = useState<Connection[]>([])
  useEffect(() => {
    setFilteredConnections(connections || [])
  }, [connections])

  const onSearch = (searchTerm : string) => {
    if(!searchTerm || searchTerm.length == 0){
      setFilteredConnections(connections || [])
      return
    }
    let searchResults = (connections || []).filter((connection) => {
      return connection.name.toLowerCase().includes(searchTerm)
    })
    setFilteredConnections(searchResults)
  }

  const handleConnectionPress = (id: string) => {
    router.push(`/connection/${id}`);
  };

  return (
    <View className="flex-1 flex-col items-center px-6 pt-4 bg-white">
      <View className="w-full">
        <ContactSearchBar onChange={onSearch}/>
        <View className="mt-4">
          {filteredConnections.map((connection) => (
            <ConnectionPill
              key={connection.id}
              id={connection.id}
              name={connection.name}
              image_url={connection.image_url}
              onPress={handleConnectionPress}
            />
          ))}
        </View>
      </View>
    </View>
  );
}




