import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { View } from "react-native";

type KVPair = { key: string; value: string };

type Inputs = {
  name: string;
  tags: KVPair[];
};

interface FormProps {
  onSubmit?: (data: { name: string; tags: Record<string, string> }) => void;
}

export const ConnectionForm = ({ onSubmit }: FormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      name: "",
      tags: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags",
  });

  const handleFormSubmit = (data: Inputs) => {
    const tags: Record<string, string> = {};
    for (const { key, value } of data.tags) {
      if (key) tags[key] = value;
    }
    onSubmit?.({ name: data.name, tags });
  };

  return (
    <View className="p-4">
      <View className="mb-4">
        <Text className="text-lg font-semibold mb-2">Create Connection</Text>
        <Text className="text-gray-600 mb-4">
          Fill in the details to create a connection
        </Text>
      </View>

      <Controller
        control={control}
        name="name"
        rules={{ required: "Connection name is required" }}
        render={({ field: { onChange, value } }) => (
          <Input
            value={value}
            onChangeText={onChange}
            placeholder="Connection name"
          />
        )}
      />
      {errors.name && (
        <Text className="text-red-500 text-sm mt-1">
          {errors.name.message}
        </Text>
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
