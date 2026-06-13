import { Tabs } from 'expo-router';
import { Home, Plus, UserCircle } from 'lucide-react-native';
import { View } from 'react-native';
import AuthLayout from '~/components/layout/auth';

export default function TabLayout() {
  return (
    <>
      <AuthLayout/>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: 'hsl(240 5.9% 10%)',
          tabBarInactiveTintColor: 'hsl(240 3.8% 46.1%)',
          tabBarStyle: {
            height: 64,
            paddingBottom: 8,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: 'hsl(240 5.9% 90%)',
            backgroundColor: 'white',
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
            marginTop: 2,
          },
          tabBarItemStyle: {
            height: 48,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Home size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="add-connection/index"
          options={{
            title: '',
            tabBarIcon: ({ color }) => (
              <View className="h-12 w-12 -mt-6 rounded-full bg-foreground items-center justify-center">
                <Plus size={24} color="white" strokeWidth={2.5} />
              </View>
            ),
            tabBarLabel: () => null,
          }}
        />
        <Tabs.Screen
          name="settings/index"
          options={{
            title: 'Account',
            tabBarIcon: ({ color, size }) => (
              <UserCircle size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        </Tabs>
    </>
  );
}

