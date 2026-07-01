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
    const term = searchTerm.toLowerCase()
    let searchResults = (connections || []).filter((connection) => {
      const fullName = `${connection.first_name} ${connection.last_name}`.toLowerCase()
      return fullName.includes(term)
    })
    setFilteredConnections(searchResults)
  }

  const handleConnectionPress = (id: string) => {
    router.push(`/connection/${id}`);
  };

  return (
    <>
        <ContactSearchBar onChange={onSearch}/>
        <View className="mt-4">
          {filteredConnections.map((connection) => (
            <ConnectionPill
              key={connection.id}
              id={connection.id}
              first_name={connection.first_name}
              last_name={connection.last_name}
              image_url={connection.image_url}
              onPress={handleConnectionPress}
            />
          ))}
        </View>
    </>
  );
}
