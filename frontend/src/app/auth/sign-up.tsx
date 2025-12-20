import { View } from "react-native"
import { SignUpForm } from "~/components/auth/sign-up-form"

export const SignUp = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <SignUpForm/>
    </View>
  )
}
export default SignUp
