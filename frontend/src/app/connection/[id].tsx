import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useConnections } from "~/hooks/useConnections";
import { useNotes } from "~/hooks/useNotes";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { ProfileImage } from "~/components/ui/profile-image";
import { ChevronLeft, Trash2 } from "lucide-react-native";

export default function ConnectionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { connections, isLoading: connectionsLoading, deleteConnection } = useConnections();
  const { createNote, getNotes } = useNotes();

  const connection = connections.find((c) => c.id === id);

  const {
    data: notes,
    isLoading: notesLoading,
  } = useQuery({
    queryKey: ["notes", id],
    queryFn: () => getNotes(id),
    enabled: !!id,
  });

  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (notes && notes.length > 0) {
      queryClient.setQueryData(["connections"], (old: any) => {
        if (!old) return old;
        return old.map((c: any) =>
          c.id === id ? { ...c, edges: { ...c.edges, notes } } : c
        );
      });
    }
  }, [notes, id, queryClient]);

  if (connectionsLoading) {
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
      await queryClient.invalidateQueries({ queryKey: ["notes", id] });
      Alert.alert("Success", "Note added");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to add note");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Connection",
      `Are you sure you want to delete ${connection.name}? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteConnection(id);
              await queryClient.invalidateQueries({ queryKey: ["connections"] });
              router.back();
            } catch (err: any) {
              Alert.alert("Error", err.message || "Failed to delete connection");
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const allNotes = notes || connection.edges?.notes || [];
  const tags = connection.edges?.tags || [];

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

        <View className="items-center gap-3">
          <ProfileImage imageUri={connection.image_url} size={96} />
          <Text className="text-3xl font-bold text-foreground">{connection.name}</Text>
        </View>

        {tags.length > 0 && (
          <View className="gap-2">
            <Label>Tags</Label>
            <View className="flex-row flex-wrap gap-2">
              {tags.map((tag, i) => (
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

        <View className="gap-4">
          <Label>Notes</Label>
          {notesLoading ? (
            <ActivityIndicator />
          ) : allNotes.length > 0 ? (
            <View className="gap-2">
              {allNotes.map((n, i) => (
                <View
                  key={n.id || i}
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

        <View className="mt-4">
          <Button
            variant="destructive"
            className="w-full flex-row gap-2"
            onPress={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" />
            ) : (
              <>
                <Trash2 size={16} className="text-white" />
                <Text>Delete Connection</Text>
              </>
            )}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
