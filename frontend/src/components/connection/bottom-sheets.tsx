import React, { useState } from "react";
import { View, TextInput, ScrollView, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Tag } from "~/types/connections";
import { Coffee, Phone, MessageCircle, PartyPopper, UtensilsCrossed, Gift, StickyNote } from "lucide-react-native";

const EVENT_TYPES = [
  { key: "coffee", label: "Coffee", icon: Coffee },
  { key: "call", label: "Call", icon: Phone },
  { key: "text", label: "Text", icon: MessageCircle },
  { key: "event", label: "Event", icon: PartyPopper },
  { key: "dinner", label: "Dinner", icon: UtensilsCrossed },
  { key: "gift", label: "Gift", icon: Gift },
  { key: "note", label: "Note", icon: StickyNote },
];

const ABOUT_FIELDS = [
  { key: "job", label: "Job" },
  { key: "company", label: "Company" },
  { key: "location", label: "Location" },
  { key: "partner", label: "Partner" },
  { key: "birthday", label: "Birthday" },
  { key: "likes", label: "Likes" },
  { key: "dislikes", label: "Dislikes" },
  { key: "how_we_met", label: "How we met" },
];

interface QuickNoteSheetProps {
  onSave: (content: string) => void;
  isSaving: boolean;
}

export function QuickNoteSheet({ onSave, isSaving }: QuickNoteSheetProps) {
  const [content, setContent] = useState("");

  return (
    <View className="gap-4 px-4 pb-8">
      <Text className="text-lg font-semibold text-foreground">Quick Note</Text>
      <TextInput
        className="min-h-[120px] rounded-xl bg-muted/50 px-4 py-3 text-base text-foreground"
        placeholder="Write something memorable..."
        placeholderTextColor="#9ca3af"
        multiline
        textAlignVertical="top"
        value={content}
        onChangeText={setContent}
      />
      <Button
        className="w-full"
        onPress={() => {
          onSave(content.trim());
          setContent("");
        }}
        disabled={isSaving || !content.trim()}
      >
        <Text>Save Note</Text>
      </Button>
    </View>
  );
}

interface LogEventSheetProps {
  onSave: (type: string, content: string) => void;
  isSaving: boolean;
}

export function LogEventSheet({ onSave, isSaving }: LogEventSheetProps) {
  const [selectedType, setSelectedType] = useState("coffee");
  const [content, setContent] = useState("");

  return (
    <View className="gap-4 px-4 pb-8">
      <Text className="text-lg font-semibold text-foreground">Log an Event</Text>

      <View className="flex-row flex-wrap gap-2">
        {EVENT_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.key;
          return (
            <Pressable
              key={type.key}
              onPress={() => setSelectedType(type.key)}
              className={`rounded-xl px-3 py-2 flex-row items-center gap-1 ${
                isSelected ? "bg-primary" : "bg-muted/50"
              }`}
            >
              <Icon
                size={14}
                className={isSelected ? "text-primary-foreground" : "text-foreground"}
              />
              <Text
                className={`text-xs font-medium ${
                  isSelected ? "text-primary-foreground" : "text-foreground"
                }`}
              >
                {type.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <TextInput
        className="min-h-[100px] rounded-xl bg-muted/50 px-4 py-3 text-base text-foreground"
        placeholder="What happened?"
        placeholderTextColor="#9ca3af"
        multiline
        textAlignVertical="top"
        value={content}
        onChangeText={setContent}
      />

      <Button
        className="w-full"
        onPress={() => {
          onSave(selectedType, content.trim());
          setContent("");
        }}
        disabled={isSaving || !content.trim()}
      >
        <Text>Save Event</Text>
      </Button>
    </View>
  );
}

interface EditAboutSheetProps {
  tags: Tag[];
  onSave: (fields: { name: string; value: string }[]) => void;
  isSaving: boolean;
}

export function EditAboutSheet({ tags, onSave, isSaving }: EditAboutSheetProps) {
  const tagMap = new Map(tags.map((t) => [t.name, t.value]));

  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const field of ABOUT_FIELDS) {
      initial[field.key] = tagMap.get(field.key) || "";
    }
    return initial;
  });

  const handleSave = () => {
    const fields = Object.entries(values)
      .filter(([, v]) => v.trim())
      .map(([name, value]) => ({ name, value: value.trim() }));
    onSave(fields);
  };

  return (
    <ScrollView className="px-4 pb-8">
      <View className="gap-4">
        <Text className="text-lg font-semibold text-foreground">About</Text>
        {ABOUT_FIELDS.map((field) => (
          <View key={field.key} className="gap-1">
            <Text className="text-xs text-muted-foreground">{field.label}</Text>
            <TextInput
              className="h-10 rounded-xl bg-muted/50 px-3 text-sm text-foreground"
              placeholder={`Add ${field.label.toLowerCase()}`}
              placeholderTextColor="#9ca3af"
              value={values[field.key]}
              onChangeText={(text) =>
                setValues((prev) => ({ ...prev, [field.key]: text }))
              }
            />
          </View>
        ))}
        <Button
          className="w-full"
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text>Save Changes</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
