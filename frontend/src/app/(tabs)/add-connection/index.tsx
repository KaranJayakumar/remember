import { PlusCircle } from "lucide-react-native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { ConnectionForm } from "~/components/connection-form";
import { AddConnection } from "~/components/ui/connections/add-connection";
import { ConnectionPill } from "~/components/ui/connections/connection-pill";
import { ContactSearchBar } from "~/components/ui/contact-search-bar";
import { useConnections } from "~/hooks/useConnections";
import { Connection } from "~/types/connections";

const mockConnections : Connection []= [
  {
    id : 'asdjflkjl', 
    name : 'Joe', 
    imageUrl : 'https://i.pravatar.cc/300'
  },
  {
    id : 'yellow', 
    name : 'Yellow', 
    imageUrl : 'https://i.pravatar.cc/300'
  },
]
export default function Homepage() {
  const { connections } = useConnections();
  const [filteredConnections, setFilteredConnections] = useState<Connection[]>([])
  useEffect(() => {
    setFilteredConnections(mockConnections)
  }, [mockConnections])

  const onSearch = (searchTerm : string) => {
    if(!searchTerm || searchTerm.length == 0){
      setFilteredConnections(mockConnections)
      return
    }
    let searchResults = filteredConnections.filter((connection) => {
      return connection.name.toLowerCase().includes(searchTerm)
    })
    setFilteredConnections(searchResults)
  }

  return (
    <>
      <View className="flex-1 flex-col items-center px-6 pt-16">
        <View className="w-full">
          <ContactSearchBar onChange={onSearch}/>
          <View className="mt-4">
            {
              filteredConnections.map((connection, index) => {
                return (
                  <ConnectionPill key={index} name={connection.name} imageUrl={connection.imageUrl}/>
                )
              })
            }
          </View>
        </View>
      </View>
      <View className="justify-end flex flex-row mr-6">
        <AddConnection/>
      </View>
    </>
  );
}



