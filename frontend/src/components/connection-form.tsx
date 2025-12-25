import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const KVPairSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
});

const ConnectionSchema = z.object({
  name: z.string().min(1, "Connection name is required"),
  tags: z.array(KVPairSchema).optional().default([]),
});

type ConnectionFormData = z.infer<typeof ConnectionSchema>;

interface FormProps {
  onSubmit: (data: { name: string; tags: Record<string, string> }) => Promise<void>;
}

export const ConnectionForm = ({ onSubmit }: FormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ConnectionFormData>({
    resolver: zodResolver(ConnectionSchema),
    defaultValues: {
      name: "",
      tags: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags",
  });

  const handleFormSubmit = async (data: ConnectionFormData) => {
    const tags: Record<string, string> = {};
    for (const { key, value } of data.tags || []) {
      if (key) tags[key] = value;
    }
    await onSubmit({ name: data.name, tags });
  };

  return (
    <View className="py-4 w-full">
      <View className="mb-4">
        <Text className="text-lg font-semibold mb-2">Create Connection</Text>
        <Text className="text-gray-600 mb-4">
          Fill in the details to create a connection
        </Text>
      </View>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <Input
            value={value}
            onChangeText={onChange}
            placeholder="Connection name"
          />
        )}
      />
      {errors.name && (
        <Text className="text-red-500 text-sm mt-1">{errors.name.message}</Text>
      )}

      <View className="mt-4">
        <Text className="text-md font-semibold mb-2">Tags</Text>
        {fields.map((field, index) => (
          <View key={field.id} className="flex-row items-center gap-2 mb-2">
            <Controller
              control={control}
              name={`tags.${index}.key`}
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  placeholder="Key"
                  className="flex-1"
                />
              )}
            />
            <Controller
              control={control}
              name={`tags.${index}.value`}
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  placeholder="Value"
                  className="flex-1"
                />
              )}
            />
            <Button variant="ghost" onPress={() => remove(index)}>
              <Text className="text-red-500">Remove</Text>
            </Button>
          </View>
        ))}
        <Button
          variant="secondary"
          onPress={() => append({ key: "", value: "" })}
        >
          <Text>Add Tag</Text>
        </Button>
      </View>

      <View className="mt-4">
        <Button onPress={handleSubmit(handleFormSubmit)}>
          <Text>Create</Text>
        </Button>
      </View>
    </View>
  );
};
