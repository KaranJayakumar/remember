import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Cog, Home } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home/>,
        }}
      />
      <Tabs.Screen
        name="add-connection"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Cog/>,
        }}
      />
    </Tabs>
  );
}

