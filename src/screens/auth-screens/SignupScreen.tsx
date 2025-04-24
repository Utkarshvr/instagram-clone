import { supabase } from "@/lib/supabase";
import { toastMsg } from "@/utils/helpers";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const isDev = __DEV__;
const redirectUrl = isDev
  ? "exp://192.168.29.190:8081/--/auth-callback"
  : "instagram://auth-callback"; // your production deep link

export default function SignupScreen() {
  const [form_value, setform_value] = useState({ email: "", password: "" });
  const isFormValid = form_value.email !== "" && form_value.password !== "";

  const [isRegistering, setIsRegistering] = useState(false);
  console.log({ redirectUrl });
  async function registerAccount() {
    setIsRegistering(true);
    const { error, data } = await supabase.auth.signUp({
      email: form_value.email,
      password: form_value.password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    setIsRegistering(false);

    if (error)
      return ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

    if (!data.session && data.user?.email) {
      toastMsg(
        `We’ve sent a confirmation email to ${data.user?.email}. Please check your inbox to activate your account.`
      );
      router.push("/verify-email");
      return;
    }

    ToastAndroid.showWithGravityAndOffset(
      "Signed up successfully!",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );

    setIsRegistering(false);
  }

  return (
    <SafeAreaView className="bg-neutral-950 flex-1 p-4 items-center ">
      <View className="w-full gap-4 items-center mt-32">
        <Image
          className="w-[240px] h-[70px]"
          source={require("../../assets/insta-dark.png")}
        />

        <View className="w-full gap-4">
          <Text className="text-neutral-500 font-montSemiBold">
            Create an account
          </Text>
          <TextInput
            onChangeText={(text) =>
              setform_value((prev) => ({ ...prev, email: text }))
            }
            value={form_value.email}
            className="p-4 w-full rounded-md bg-neutral-800 text-neutral-50 font-mont"
            placeholder="Enter Email"
            placeholderTextColor={"white"}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            onChangeText={(text) =>
              setform_value((prev) => ({ ...prev, password: text }))
            }
            value={form_value.password}
            className="p-4 w-full rounded-md bg-neutral-800 text-neutral-50 font-mont"
            placeholder="Enter Password"
            placeholderTextColor={"white"}
            autoCapitalize="none"
            secureTextEntry
          />

          <TouchableOpacity
            onPress={registerAccount}
            disabled={!isFormValid && isRegistering}
            className="w-full"
          >
            <View
              className={`${
                isFormValid && !isRegistering ? "bg-sky-500" : "bg-neutral-700"
              } p-2 rounded-md w-full items-center`}
            >
              {isRegistering ? (
                <ActivityIndicator size={"small"} color={"white"} />
              ) : (
                <Text className="font-mont text-white">Register</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <Text className="text-neutral-400 font-mont">
          Already have an account?{" "}
          <Link href={"/(public)/(auth-screens)/signin"} asChild replace>
            <Text className="text-sky-600 font-montSemiBold">Login</Text>
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
}
