import { Search } from "lucide-react-native"
import { TextInput, View } from "react-native"

interface Props{
  className? : string
  onChange : (searchTerm : string) => void
}

export const ContactSearchBar = ({className, onChange} : Props) => {
  return (
    <View className={`w-full border rounded-2xl flex flex-row ${className} h-12 items-center`}>
      <View className='ml-3'>
        <Search/>
      </View>
      <TextInput placeholder='Search Contacts' 
        onChangeText={(searchTerm) => onChange(searchTerm)}>
      </TextInput>
    
    </View>
  )
}

