import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useMemo, useCallback } from "react";
import { ActivityIndicator, ScrollView, View, Pressable } from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useConnections } from "~/hooks/useConnections";
import { useNotes } from "~/hooks/useNotes";
import { useInteractions } from "~/hooks/useInteractions";
import { useTags } from "~/hooks/useTags";
import { Text } from "~/components/ui/text";
import { ProfileImage } from "~/components/ui/profile-image";
import { ChevronLeft, Plus, Calendar } from "lucide-react-native";
import { Timeline } from "~/components/connection/timeline";
import { AboutSection } from "~/components/connection/about-section";
import { HoldToDelete } from "~/components/connection/hold-to-delete";
import { QuickNoteSheet, LogEventSheet, EditAboutSheet } from "~/components/connection/bottom-sheets";
import { BottomSheet, RNHostView } from "@expo/ui";

function formatLastTalked(dateStr?: string) {
  if (!dateStr) return "Never";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export default function ConnectionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { connections, isLoading: connectionsLoading, deleteConnection, refetch } = useConnections();
  const { createNote, getNotes } = useNotes();
  const { createInteraction, getInteractions } = useInteractions();
  const { getTags, createTag, deleteTag } = useTags();

  const connection = connections.find((c) => c.id === id);

  const { data: notes, isLoading: notesLoading } = useQuery({
    queryKey: ["notes", id],
    queryFn: () => getNotes(id),
    enabled: !!id,
  });

  const { data: interactions, isLoading: interactionsLoading } = useQuery({
    queryKey: ["interactions", id],
    queryFn: () => getInteractions(id),
    enabled: !!id,
  });

  const { data: tags, isLoading: tagsLoading } = useQuery({
    queryKey: ["tags", id],
    queryFn: () => getTags(id),
    enabled: !!id,
  });

  const [activeSheet, setActiveSheet] = useState<"note" | "event" | "about" | null>(null);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isSavingEvent, setIsSavingEvent] = useState(false);
  const [isSavingAbout, setIsSavingAbout] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const allNotes = notes || connection?.notes || [];
  const allInteractions = interactions || connection?.interactions || [];
  const allTags = tags || [];

  const lastTalked = useMemo(() => {
    const allItems = [
      ...allNotes.map((n) => n.created_at),
      ...allInteractions.map((i) => i.created_at),
    ].filter(Boolean);
    if (allItems.length === 0) return null;
    const mostRecent = allItems.sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    )[0];
    return formatLastTalked(mostRecent);
  }, [allNotes, allInteractions]);

  const handleAddNote = useCallback(
    async (content: string) => {
      if (!content) return;
      setIsSavingNote(true);
      try {
        await createNote(id, content);
        queryClient.invalidateQueries({ queryKey: ["notes", id] });
        setActiveSheet(null);
      } catch (err: any) {
        alert(err.message || "Failed to add note");
      } finally {
        setIsSavingNote(false);
      }
    },
    [id, createNote, queryClient]
  );

  const handleAddEvent = useCallback(
    async (type: string, content: string) => {
      if (!content) return;
      setIsSavingEvent(true);
      try {
        await createInteraction(id, type, content);
        queryClient.invalidateQueries({ queryKey: ["interactions", id] });
        setActiveSheet(null);
      } catch (err: any) {
        alert(err.message || "Failed to log event");
      } finally {
        setIsSavingEvent(false);
      }
    },
    [id, createInteraction, queryClient]
  );

  const handleSaveAbout = useCallback(
    async (fields: { name: string; value: string }[]) => {
      setIsSavingAbout(true);
      try {
        // Delete existing about tags first
        const existingAboutTags = allTags.filter((t) =>
          [
            "job",
            "company",
            "location",
            "partner",
            "birthday",
            "likes",
            "dislikes",
            "how_we_met",
          ].includes(t.name)
        );
        for (const tag of existingAboutTags) {
          await deleteTag(tag.id);
        }
        // Create new tags
        for (const field of fields) {
          await createTag(id, field.name, field.value);
        }
        queryClient.invalidateQueries({ queryKey: ["tags", id] });
        setActiveSheet(null);
      } catch (err: any) {
        alert(err.message || "Failed to save details");
      } finally {
        setIsSavingAbout(false);
      }
    },
    [id, allTags, createTag, deleteTag, queryClient]
  );

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      await deleteConnection(id);
      await refetch();
      router.back();
    } catch (err: any) {
      alert(err.message || "Failed to delete connection");
      setIsDeleting(false);
    }
  }, [id, deleteConnection, refetch, router]);

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
        <Pressable
          onPress={() => router.back()}
          className="mt-4 rounded-xl bg-primary px-4 py-3"
        >
          <Text className="text-primary-foreground text-sm font-medium">Go back</Text>
        </Pressable>
      </View>
    );
  }

  const displayName = `${connection.first_name} ${connection.last_name}`.trim();

  return (
    <>
      <ScrollView className="flex-1 bg-background">
        <View className="px-6 pt-4 pb-10 gap-8">
          {/* Header */}
          <Pressable
            onPress={() => router.back()}
            className="self-start flex-row items-center gap-1 py-2"
          >
            <ChevronLeft size={18} className="text-foreground" />
            <Text className="text-sm text-foreground">Back</Text>
          </Pressable>

          {/* Profile */}
          <View className="items-center gap-3">
            <ProfileImage imageUri={connection.image_url} size={120} />
            <Text className="text-3xl font-bold text-foreground">{displayName}</Text>
            <Text className="text-sm text-muted-foreground">
              Last talked: {lastTalked || "Never"}
            </Text>
          </View>

          {/* Quick Actions */}
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => setActiveSheet("note")}
              className="flex-1 rounded-2xl bg-primary items-center justify-center py-4"
            >
              <View className="flex-row items-center gap-2">
                <Plus size={16} className="text-primary-foreground" />
                <Text className="text-sm font-medium text-primary-foreground">Quick Note</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => setActiveSheet("event")}
              className="flex-1 rounded-2xl bg-secondary items-center justify-center py-4"
            >
              <View className="flex-row items-center gap-2">
                <Calendar size={16} className="text-secondary-foreground" />
                <Text className="text-sm font-medium text-secondary-foreground">Log Event</Text>
              </View>
            </Pressable>
          </View>

          {/* About Them */}
          <View className="gap-2">
            <AboutSection tags={allTags} onEdit={() => setActiveSheet("about")} />
          </View>

          {/* Timeline */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">Timeline</Text>
            {notesLoading || interactionsLoading || tagsLoading ? (
              <ActivityIndicator className="py-8" />
            ) : (
              <Timeline interactions={allInteractions} notes={allNotes} />
            )}
          </View>

          {/* Danger Zone */}
          <HoldToDelete name={displayName} onDelete={handleDelete} />
        </View>
      </ScrollView>

      {/* Bottom Sheets */}
      <BottomSheet
        isPresented={activeSheet === "note"}
        onDismiss={() => setActiveSheet(null)}
      >
        <RNHostView>
          <QuickNoteSheet onSave={handleAddNote} isSaving={isSavingNote} />
        </RNHostView>
      </BottomSheet>

      <BottomSheet
        isPresented={activeSheet === "event"}
        onDismiss={() => setActiveSheet(null)}
      >
        <RNHostView>
          <LogEventSheet onSave={handleAddEvent} isSaving={isSavingEvent} />
        </RNHostView>
      </BottomSheet>

      <BottomSheet
        isPresented={activeSheet === "about"}
        onDismiss={() => setActiveSheet(null)}
      >
        <RNHostView>
          <EditAboutSheet
            tags={allTags}
            onSave={handleSaveAbout}
            isSaving={isSavingAbout}
          />
        </RNHostView>
      </BottomSheet>
    </>
  );
}
