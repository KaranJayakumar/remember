import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

export default function TabLayout() {
  return (
    <Tabs>
      <TabSlot />
      <TabList
        className="
          absolute bottom-6 left-4 right-4
          flex-row justify-between items-center
          h-12
          rounded-2xl
          bg-black/90
          border border-white/10
          shadow-lg
        "
      >
        <TabTrigger
          name="home"
          href="/"
          className="
            flex-1 items-center justify-center
            rounded-xl
            active:bg-white/10
          "
        >
          <FontAwesome name="home" color="white" size={20}/>
        </TabTrigger>
        <TabTrigger
          name="home"
          href="/asdjfl"
          className="
            flex-1 items-center justify-center
            rounded-xl
            active:bg-white/10
          "
        >
        <FontAwesome name="plus" color="white" size={20}/>
        </TabTrigger>

        {/* Example second tab */}
        <TabTrigger
          name="profile"
          href="/profile"
          className="
            flex-1 items-center justify-center
            rounded-xl
            py-2
            active:bg-white/10
          "
        >
          <FontAwesome name="user" color="white" size={20}/>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

