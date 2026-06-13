import { CircleUser, Plus, Trash2, Camera } from "lucide-react-native";
import { ActivityIndicator, Alert, Image, ScrollView, View } from "react-native";
import { useForm } from '@tanstack/react-form';
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { useConnections } from "~/hooks/useConnections";
import { useNotes } from "~/hooks/useNotes";
import * as ImagePicker from 'expo-image-picker';

export default function AddConnection() {
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
      const name = `${value.firstName.trim()} ${value.lastName.trim()}`.trim();
      if (!name) {
        Alert.alert('Error', 'Please enter a name');
        return;
      }

      try {
        let imageUrl: string | undefined;
        if (value.imageUri) {
          imageUrl = await uploadImage(value.imageUri, 'image/jpeg');
        }

        const connection = await createConnection(name, undefined, imageUrl);
        const connectionId = connection.id;

        const validNotes = value.notes.filter((n) => n.trim().length > 0);
        for (const note of validNotes) {
          await createNote(connectionId, note.trim());
        }

        await queryClient.invalidateQueries({ queryKey: ["connections"] });
        Alert.alert('Success', 'Connection created!');
        form.reset();
      } catch (err: any) {
        Alert.alert('Error', err.message || 'Failed to create connection');
      }
    }
  });

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Please allow access to your photo library to upload a profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      form.setFieldValue('imageUri', result.assets[0].uri);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="pb-10">
      <View className="flex-1 flex-col items-center px-6 pt-16">
        <View className="mb-8 items-center justify-center">
          <form.Field
            name="imageUri"
            children={(field) => (
              <View className="items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onPress={pickImage}
                  className="h-24 w-24 rounded-full p-0 overflow-hidden"
                >
                  {field.state.value ? (
                    <Image
                      source={{ uri: field.state.value }}
                      className="h-24 w-24 rounded-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="h-24 w-24 rounded-full bg-secondary items-center justify-center">
                      <CircleUser size={64} className="text-muted-foreground" strokeWidth={1.5} />
                    </View>
                  )}
                </Button>
                <View className="flex-row items-center gap-2 mt-3">
                  <Camera size={16} className="text-muted-foreground" />
                  <Text className="text-muted-foreground text-sm">
                    {field.state.value ? 'Change photo' : 'Add photo'}
                  </Text>
                </View>
              </View>
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
