import { View } from "react-native"
import { SignUpForm } from "~/components/auth/sign-up-form"
import Logo from "~/components/brand/logo"

export const SignUp = () => {
  return (
    <View className="flex-1 bg-slate-50 justify-center items-center px-4">
      <Logo />
      <SignUpForm/>
    </View>
  )
}
export default SignUp
