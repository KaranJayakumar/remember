import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Interaction } from "~/types/connections";
import { Coffee, Phone, MessageCircle, PartyPopper, UtensilsCrossed, Gift, StickyNote, Calendar } from "lucide-react-native";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  coffee: <Coffee size={18} className="text-foreground" />,
  call: <Phone size={18} className="text-foreground" />,
  text: <MessageCircle size={18} className="text-foreground" />,
  event: <PartyPopper size={18} className="text-foreground" />,
  dinner: <UtensilsCrossed size={18} className="text-foreground" />,
  gift: <Gift size={18} className="text-foreground" />,
  note: <StickyNote size={18} className="text-foreground" />,
};

function getIcon(type: string) {
  const key = type.toLowerCase();
  for (const [k, icon] of Object.entries(TYPE_ICONS)) {
    if (key.includes(k)) return icon;
  }
  return <Calendar size={18} className="text-foreground" />;
}

function groupByMonth(interactions: Interaction[]) {
  const groups: Record<string, Interaction[]> = {};
  const sorted = [...interactions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  for (const i of sorted) {
    const date = new Date(i.created_at);
    const key = date.toLocaleString("en-US", { month: "long", year: "numeric" });
    if (!groups[key]) groups[key] = [];
    groups[key].push(i);
  }
  return groups;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", { month: "short", day: "numeric" });
}

interface TimelineProps {
  interactions: Interaction[];
  notes: { id: number; content: string; created_at: string }[];
}

export function Timeline({ interactions, notes }: TimelineProps) {
  const allItems = [
    ...interactions.map((i) => ({ ...i, kind: "interaction" as const })),
    ...notes.map((n) => ({ ...n, type: "note", content: n.content, kind: "note" as const, photo_url: "" })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const grouped = groupByMonth(allItems);

  return (
    <View className="gap-6">
      {Object.entries(grouped).map(([month, items]) => (
        <View key={month} className="gap-4">
          <View className="flex-row items-center gap-3">
            <View className="h-px flex-1 bg-muted" />
            <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {month}
            </Text>
            <View className="h-px flex-1 bg-muted" />
          </View>

          <View className="gap-4">
            {items.map((item, idx) => (
              <View key={item.id ?? idx} className="flex-row gap-4">
                <View className="items-center gap-1">
                  <View className="w-9 h-9 rounded-full bg-muted items-center justify-center">
                    {getIcon(item.type || "note")}
                  </View>
                  {idx < items.length - 1 && (
                    <View className="w-px flex-1 bg-muted" />
                  )}
                </View>

                <View className="flex-1 gap-1 pb-4">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-xs text-muted-foreground">
                      {formatDate(item.created_at)}
                    </Text>
                    <Text className="text-xs font-medium text-foreground capitalize">
                      {item.type || "Note"}
                    </Text>
                  </View>
                  <Text className="text-sm text-foreground leading-relaxed">
                    {item.content}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}

      {allItems.length === 0 && (
        <Text className="text-sm text-muted-foreground text-center py-8">
          No interactions yet. Tap "Log Event" to get started.
        </Text>
      )}
    </View>
  );
}
