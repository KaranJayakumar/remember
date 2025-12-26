import { useRouter } from "expo-router"
import { PlusCircle, View } from "lucide-react-native"

export const AddConnection = () => {
  const router = useRouter()
  const triggerConnectionAdd = () => {
    router.push("/(v1)/contacts/add")
  }
  return (
    <PlusCircle width={30} height={30} onPress={triggerConnectionAdd}/>
  )
}

