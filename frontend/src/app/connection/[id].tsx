import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import { useConnections } from "~/hooks/useConnections";
import { useNotes } from "~/hooks/useNotes";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { ChevronLeft } from "lucide-react-native";

export default function ConnectionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { connections, isLoading } = useConnections();
  const { createNote } = useNotes();

  const connection = connections.find((c) => c.id === id);
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (!connection) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-lg">Connection not found</Text>
        <Button className="mt-4" onPress={() => router.back()}>
          <Text>Go back</Text>
        </Button>
      </View>
    );
  }

  const handleAddNote = async () => {
    if (!note.trim()) return;
    setIsSaving(true);
    try {
      await createNote(id, note.trim());
      setNote("");
      Alert.alert("Success", "Note added");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to add note");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-6 pt-4 pb-10 gap-6">
        <Button
          variant="ghost"
          size="sm"
          className="self-start flex-row gap-1"
          onPress={() => router.back()}
        >
          <ChevronLeft size={16} className="text-foreground" />
          <Text>Back</Text>
        </Button>

        <View className="gap-1">
          <Text className="text-3xl font-bold text-foreground">{connection.name}</Text>
        </View>

        <View className="gap-4">
          <Label>Notes</Label>
          {connection.notes && connection.notes.length > 0 ? (
            <View className="gap-2">
              {connection.notes.map((n, i) => (
                <View
                  key={i}
                  className="border rounded-xl p-4 bg-card"
                >
                  <Text className="text-sm text-card-foreground">{n.content}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text className="text-muted-foreground text-sm">No notes yet</Text>
          )}
        </View>

        <View className="gap-2">
          <Label>Add a note</Label>
          <Input
            placeholder="Write something..."
            value={note}
            onChangeText={setNote}
            multiline
            className="min-h-[80px] py-2"
          />
          <Button
            className="w-full"
            onPress={handleAddNote}
            disabled={isSaving || !note.trim()}
          >
            {isSaving ? (
              <ActivityIndicator size="small" />
            ) : (
              <Text>Save Note</Text>
            )}
          </Button>
        </View>

        {connection.tags && connection.tags.length > 0 && (
          <View className="gap-2">
            <Label>Tags</Label>
            <View className="flex-row flex-wrap gap-2">
              {connection.tags.map((tag, i) => (
                <View
                  key={i}
                  className="px-3 py-1 rounded-full bg-secondary"
                >
                  <Text className="text-xs text-secondary-foreground">
                    {tag.name}: {tag.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
