import { Search } from "lucide-react-native"
import { TextInput, View } from "react-native"

interface Props{
  className? : string
  onChange : (searchTerm : string) => void
}

export const ContactSearchBar = ({className, onChange} : Props) => {
  return (
    <View className={`w-full border rounded-2xl flex flex-row ${className} h-10 items-center`}>
      <View className='ml-3'>
        <Search height={16} width={16}/>
      </View>
      <TextInput placeholder='Search connections'inlineImagePadding={0} 
        style={{
          paddingTop : 0,
          paddingBottom : 0,
        }}
        onChangeText={(searchTerm) => onChange(searchTerm)}>
      </TextInput>
    </View>
  )
}

