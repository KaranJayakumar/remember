import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { View } from "react-native";

type KVPair = { key: string; value: string };

type Inputs = {
  name: string;
  tags: KVPair[];
};

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const ConnectionModal = ({ isOpen, setIsOpen }: ModalProps) => {
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

  const onSubmit = (data: Inputs) => {
    const tags: Record<string, string> = {};
    for (const { key, value } of data.tags) {
      if (key) tags[key] = value;
    }
    console.log("Submitted:", { name: data.name, tags });
    setIsOpen(false); // Close after submit
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} asChild>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Connection</DialogTitle>
          <DialogDescription>
            Fill in the details to create a connection
          </DialogDescription>
        </DialogHeader>

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

        <DialogFooter className="mt-4">
          <Button onPress={handleSubmit(onSubmit)}>
            <Text>Create</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
