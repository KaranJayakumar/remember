import { Text, View, TextInput, Alert } from "react-native"
import { useForm, Controller } from "react-hook-form"
import Button from "../../components/ui/Button"

export default function SignIn() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const onSubmit = () => {

  }
  return (
    <View className="flex-1 justify-center items-center">
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="email"
      />

      <Controller
        control={control}
        rules={{
          maxLength: 100,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            secureTextEntry={true}
            placeholder="Password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="password"
      />
      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  )
}

