import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { Tag } from "~/types/connections";
import { Pencil } from "lucide-react-native";

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

interface AboutSectionProps {
  tags: Tag[];
  onEdit: () => void;
}

export function AboutSection({ tags, onEdit }: AboutSectionProps) {
  const tagMap = new Map(tags.map((t) => [t.name, t.value]));

  const hasAnyFields = ABOUT_FIELDS.some((f) => tagMap.has(f.key));

  return (
    <View className="rounded-2xl bg-muted/30">
      <View className="px-5 py-4">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-sm font-medium text-foreground">About Them</Text>
          <Pressable onPress={onEdit} className="p-1">
            <Pencil size={14} className="text-muted-foreground" />
          </Pressable>
        </View>

        {hasAnyFields ? (
          <View className="gap-2">
            {ABOUT_FIELDS.map((field) => {
              const value = tagMap.get(field.key);
              if (!value) return null;
              return (
                <View key={field.key} className="flex-row gap-3">
                  <Text className="text-xs text-muted-foreground w-20 shrink-0">
                    {field.label}
                  </Text>
                  <Text className="text-sm text-foreground flex-1">{value}</Text>
                </View>
              );
            })}
          </View>
        ) : (
          <Pressable onPress={onEdit}>
            <Text className="text-sm text-muted-foreground">
              Tap to add details about this person
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

interface AboutEditFormProps {
  tags: Tag[];
  onSave: (fields: { name: string; value: string }[]) => void;
  onCancel: () => void;
}

export function AboutEditForm({ tags, onSave, onCancel }: AboutEditFormProps) {
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
    <View className="gap-4">
      {ABOUT_FIELDS.map((field) => (
        <View key={field.key} className="gap-1">
          <Text className="text-xs text-muted-foreground">{field.label}</Text>
          <View className="h-10 rounded-lg bg-muted/50 px-3 justify-center">
            <Text
              className="text-sm text-foreground"
              // Using native TextInput would be better but wireframe shows simple fields
              // We'll use a simple input via a callback in the actual sheet
            >
              {values[field.key] || "—"}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
