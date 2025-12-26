import { useRouter } from "expo-router"
import { PlusCircle, View } from "lucide-react-native"

export const AddConnection = () => {
  const router = useRouter()
  const triggerConnectionAdd = () => {
    router.push("/(tabs)/add-connection")
  }
  return (
    <PlusCircle width={30} height={30} onPress={triggerConnectionAdd}/>
  )
}

