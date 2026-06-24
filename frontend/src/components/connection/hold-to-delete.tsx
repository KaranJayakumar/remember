import React, { useCallback, useRef, useState } from "react";
import { View, Animated, Alert } from "react-native";
import { Text } from "~/components/ui/text";
import { Trash2 } from "lucide-react-native";

const HOLD_DURATION = 1500;

interface HoldToDeleteProps {
  name: string;
  onDelete: () => void;
}

export function HoldToDelete({ name, onDelete }: HoldToDeleteProps) {
  const progress = useRef(new Animated.Value(0)).current;
  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const startHold = useCallback(() => {
    setIsHolding(true);
    progress.setValue(0);
    animationRef.current = Animated.timing(progress, {
      toValue: 1,
      duration: HOLD_DURATION,
      useNativeDriver: false,
    });
    animationRef.current.start(({ finished }) => {
      if (finished) {
        Alert.alert(
          `Delete ${name}?`,
          "This will remove all notes, photos, and tags. This cannot be undone.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: onDelete,
            },
          ]
        );
      }
      setIsHolding(false);
    });
  }, [name, onDelete, progress]);

  const endHold = useCallback(() => {
    setIsHolding(false);
    if (animationRef.current) {
      animationRef.current.stop();
    }
    Animated.timing(progress, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthInterpolation = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="rounded-2xl bg-muted/50 overflow-hidden">
      <View className="px-5 py-4">
        <Text className="text-sm font-medium text-destructive mb-1">Danger Zone</Text>
        <Text className="text-xs text-muted-foreground mb-3">
          Hold to delete this connection
        </Text>
        <View
          className="relative rounded-xl bg-destructive/10 overflow-hidden h-12 items-center justify-center"
          onTouchStart={startHold}
          onTouchEnd={endHold}
        >
          <Animated.View
            className="absolute left-0 top-0 bottom-0 bg-destructive/20"
            style={{ width: widthInterpolation }}
          />
          <View className="flex-row items-center gap-2 z-10">
            <Trash2 size={16} className="text-destructive" />
            <Text className="text-sm font-medium text-destructive">
              {isHolding ? "Keep holding..." : "Hold to delete"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
