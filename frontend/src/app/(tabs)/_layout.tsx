import { Tabs } from 'expo-router';
import { Cog, Home, PlusCircle } from 'lucide-react-native';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown : false,
          title: 'Home',
          tabBarIcon: ({ color }) => <Home/>,
        }}
      />
      <Tabs.Screen
        name="add-connection/index"
        options={{
          headerShown : false,
          title : '',
          tabBarIcon: ({ color }) => {
            return(
              <View className="pt-2">
                <PlusCircle width={30} height={30}/>
              </View>
            )
          },
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          headerShown : false,
          title: 'Settings',
          tabBarIcon: ({ color }) => <Cog/>,
        }}
      />
    </Tabs>
  );
}

