import { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { Link } from "expo-router";
import { supabase } from "@/lib/supabase";
export default function SignInScreen() {
  const [form_value, setform_value] = useState({ email: "", password: "" });
  const isFormValid = form_value.email !== "" && form_value.password !== "";

  const [isLogging, setIsLogging] = useState(false);

  async function loginAccount() {
    setIsLogging(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: form_value.email,
      password: form_value.password,
    });

    if (error) {
      return ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
    ToastAndroid.showWithGravityAndOffset(
      "Welcome back!",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
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
            Login to your account
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
            className="w-full"
            disabled={!isFormValid && isLogging}
            onPress={loginAccount}
          >
            <View
              className={`${
                isFormValid && !isLogging ? "bg-sky-500" : "bg-neutral-700"
              } p-2 rounded-md w-full items-center`}
            >
              {isLogging ? (
                <ActivityIndicator size={"small"} color={"white"} />
              ) : (
                <Text className="font-mont text-white">Log in</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <Text className="text-neutral-400 font-mont">
          Don't have an account?{" "}
          <Link href={"/(public)/(auth-screens)/signup"} asChild replace>
            <Text className="text-sky-600 font-montSemiBold">Register</Text>
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
}
