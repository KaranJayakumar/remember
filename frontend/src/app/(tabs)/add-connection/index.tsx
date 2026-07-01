import { Plus, Trash2 } from "lucide-react-native";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from '@tanstack/react-form';
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { ChooseProfileImage } from "~/components/ui/choose-profile-image";
import { useConnections } from "~/hooks/useConnections";

export default function AddConnection() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { createConnection, uploadImage } = useConnections();

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      imageUri: null as string | null,
      notes: ['']
    },
    onSubmit: async ({ value }) => {
      try {
        let imageUrl: string | undefined;
        if (value.imageUri) {
          imageUrl = await uploadImage(value.imageUri, 'image/jpeg');
        }

        const connection = await createConnection(value.firstName.trim(), value.lastName.trim(), imageUrl);
        const connectionId = connection.id;
        await queryClient.invalidateQueries({ queryKey: ["connections"] });
        Alert.alert('Success', 'Connection created!', [
          {
            text: 'OK',
            onPress: () => {
              form.reset();
              router.push(`/connection/${connectionId}`);
            },
          },
        ]);
      } catch (err: any) {
        Alert.alert('Error', err.message || 'Failed to create connection');
      }
    }
  });

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="pb-10">
      <View className="flex-1 flex-col items-center px-6 pt-16">
        <View className="mb-8 items-center justify-center">
          <form.Field
            name="imageUri"
            children={(field) => (
              <ChooseProfileImage
                imageUri={field.state.value}
                onImageSelected={(uri) => form.setFieldValue('imageUri', uri)}
                size={96}
              />
            )}
          />
          <Text className="mt-4 text-2xl font-bold">New Connection</Text>
          <Text className="text-muted-foreground">Add someone you want to remember</Text>
        </View>

        <form.Subscribe
          selector={(state) => state.isSubmitting}
          children={(isSubmitting) => (
            <>
              <View className="w-full gap-6">
                <form.Field
                  name="firstName"
                  children={(field) => (
                    <View className="gap-2">
                      <Label nativeID="firstName">First Name</Label>
                      <Input
                        placeholder="e.g. John"
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        editable={!isSubmitting}
                      />
                      {field.state.meta.errors ? (
                        <Text className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</Text>
                      ) : null}
                    </View>
                  )}
                />

                <form.Field
                  name="lastName"
                  children={(field) => (
                    <View className="gap-2">
                      <Label nativeID="lastName">Last Name</Label>
                      <Input
                        placeholder="e.g. Doe"
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        editable={!isSubmitting}
                      />
                    </View>
                  )}
                />
                <View className="mt-4 gap-4">
                  <Button
                    size="lg"
                    onPress={() => form.handleSubmit()}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator size="small" />
                    ) : (
                      <Text>Save Connection</Text>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    onPress={() => form.reset()}
                    disabled={isSubmitting}
                  >
                    <Text>Clear Form</Text>
                  </Button>
                </View>
              </View>
            </>
          )}
        />
      </View>
    </ScrollView>
  );
}
