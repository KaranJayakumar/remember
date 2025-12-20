import { Tabs,TabTrigger, TabSlot } from 'expo-router/ui';
import { CustomTabList } from "~/components/layout/custom-tab-list";
import { Text } from "~/components/ui/text";

export default function TabLayout() {
  return (
    <Tabs>
      <TabSlot />
      <CustomTabList>
        <TabTrigger name="home" href="/auth/sign-in">
          <Text>Home</Text>
        </TabTrigger>
      </CustomTabList>
    </Tabs>
  );
}
