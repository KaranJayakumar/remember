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
import { useNotes } from "~/hooks/useNotes";

export default function AddConnection() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { createConnection, uploadImage } = useConnections();
  const { createNote } = useNotes();

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      imageUri: null as string | null,
      notes: ['']
    },
    onSubmit: async ({ value }) => {
      if (!name) {
        Alert.alert('Error', 'Please enter a name');
        return;
      }

      try {
        let imageUrl: string | undefined;
        if (value.imageUri) {
          imageUrl = await uploadImage(value.imageUri, 'image/jpeg');
        }

        const connection = await createConnection(value.firstName.trim(), value.lastName.trim(), imageUrl);
        const connectionId = connection.id;

        const validNotes = value.notes.filter((n) => n.trim().length > 0);
        for (const note of validNotes) {
          await createNote(connectionId, note.trim());
        }

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

                <View className="gap-4">
                  <View className="flex-row justify-between items-center">
                    <Label>Notes</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onPress={() => form.setFieldValue('notes', (prev) => [...prev, ''])}
                      className="flex-row gap-2 h-9"
                      disabled={isSubmitting}
                    >
                      <Plus size={16} className="text-foreground" />
                      <Text>Add Note</Text>
                    </Button>
                  </View>

                  <form.Subscribe
                    selector={(state) => state.values.notes}
                    children={(notes: any) => (
                      <View className="gap-3">
                        {notes.map((note: string, index: number) => (
                          <form.Field
                            key={index}
                            name={`notes[${index}]`}
                            children={(subField) => (
                              <View className="flex-row gap-2 items-center">
                                <View className="flex-1">
                                  <Input
                                    placeholder={`Note ${index + 1}`}
                                    value={subField.state.value}
                                    onChangeText={subField.handleChange}
                                    multiline
                                    className="min-h-[44px] py-2"
                                    editable={!isSubmitting}
                                  />
                                </View>
                                {notes.length > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onPress={() => {
                                      const newNotes = [...notes];
                                      newNotes.splice(index, 1);
                                      form.setFieldValue('notes', newNotes);
                                    }}
                                    className="h-11 w-11"
                                    disabled={isSubmitting}
                                  >
                                    <Trash2 size={20} className="text-destructive" />
                                  </Button>
                                )}
                              </View>
                            )}
                          />
                        ))}
                      </View>
                    )}
                  />
                </View>
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
