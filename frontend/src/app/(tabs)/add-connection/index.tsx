import { CircleUser, Plus, Trash2 } from "lucide-react-native";
import { Alert, ScrollView, View } from "react-native";
import { useForm } from '@tanstack/react-form';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";

export default function AddConnection() {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      notes: ['']
    },
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value);
      Alert.alert('Success', 'Connection created (dummy)!');
      form.reset();
    }
  });

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="pb-10">
      <View className="flex-1 flex-col items-center px-6 pt-16">
        <View className="mb-8 items-center justify-center">
          <View className="h-24 w-24 rounded-full bg-secondary items-center justify-center">
            <CircleUser size={64} className="text-muted-foreground" strokeWidth={1.5} />
          </View>
          <Text className="mt-4 text-2xl font-bold">New Connection</Text>
          <Text className="text-muted-foreground">Add someone you want to remember</Text>
        </View>

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
              >
                <Plus size={16} className="text-foreground" />
                <Text>Add Note</Text>
              </Button>
            </View>

            <form.Subscribe
              selector={(state) => state.values.notes}
              children={(notes : any) => (
                <View className="gap-3">
                  {notes.map((i : any) => (
                    <form.Field
                      key={i}
                      name={`notes[${i}]`}
                      children={(subField) => (
                        <View className="flex-row gap-2 items-center">
                          <View className="flex-1">
                            <Input
                              placeholder={`Note ${i + 1}`}
                              value={subField.state.value}
                              onChangeText={subField.handleChange}
                              multiline
                              className="min-h-[44px] py-2"
                            />
                          </View>
                          {notes.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onPress={() => {
                                const newNotes = [...notes];
                                newNotes.splice(i, 1);
                                form.setFieldValue('notes', newNotes);
                              }}
                              className="h-11 w-11"
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
            >
              <Text>Save Connection</Text>
            </Button>
            
            <Button 
              variant="ghost"
              onPress={() => form.reset()}
            >
              <Text>Clear Form</Text>
            </Button>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
