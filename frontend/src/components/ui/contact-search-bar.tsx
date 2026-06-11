import { Search } from "lucide-react-native"
import { TextInput, View } from "react-native"

interface Props {
  className?: string
  onChange: (searchTerm: string) => void
}

export const ContactSearchBar = ({ className, onChange }: Props) => {
  return (
    <View className={`w-full border rounded-2xl flex flex-row ${className} h-11 items-center bg-card px-3`}>
      <View className="flex-row items-center flex-1">
        <Search size={16} className="text-muted-foreground" />
        <View className="flex-1 justify-center pb-[3px]">
          <TextInput
            placeholder="Search connections"
            placeholderTextColor="hsl(240 3.8% 46.1%)"
            className="text-base text-foreground ml-2"
            style={{ paddingTop: 0, paddingBottom: 0, includeFontPadding: false }}
            onChangeText={onChange}
          />
        </View>
      </View>
    </View>
  )
}

