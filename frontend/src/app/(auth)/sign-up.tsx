import { View } from "react-native"
import { SignUpForm } from "~/components/auth/sign-up-form"
import Logo from "~/components/brand/logo"

export const SignUp = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <Logo />
      <SignUpForm/>
    </View>
  )
}
export default SignUp
