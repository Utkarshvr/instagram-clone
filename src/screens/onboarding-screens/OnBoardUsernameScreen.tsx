import { supabase } from "@/lib/supabase";
import { useSessionStore } from "@/store/SessionStore";
import { ProfileType } from "@/types/supabase-schema-types";
import { router } from "expo-router";
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

export default function OnBoardUsernameScreen() {
  const { setProfile, profile, session } = useSessionStore();

  const [form_value, setform_value] = useState({
    username: "",
  });

  const isFormValid = form_value.username.length > 0;
  const [isCreatingUsername, setIsCreatingUsername] = useState(false);

  async function createUsername() {
    setIsCreatingUsername(true);

    const { error } = await supabase.from("profiles").upsert({
      id: session?.user?.id,
      username: form_value.username,
    });
    setIsCreatingUsername(false);
    console.log(error);
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
      "Username created successfully",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );

    setProfile({
      ...profile,
      id: session?.user?.id,
      email: session?.user?.email,
      phone: session?.user?.phone,
      username: form_value.username,
    } as ProfileType);

    // Replace the current screen with the home screen after creating the username
    router.replace("/");
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
            Create an username
          </Text>

          <TextInput
            onChangeText={(text) =>
              setform_value((prev) => ({ ...prev, username: text }))
            }
            value={form_value.username}
            className="p-4 w-full rounded-md bg-neutral-800 text-neutral-50 font-mont"
            placeholder="Enter username"
            placeholderTextColor={"white"}
            autoCapitalize="none"
            keyboardType="default"
          />

          <TouchableOpacity
            className="w-full"
            disabled={!isFormValid && isCreatingUsername}
            onPress={createUsername}
          >
            <View
              className={`${
                isFormValid && !isCreatingUsername
                  ? "bg-sky-500"
                  : "bg-neutral-700"
              } p-2 rounded-md w-full items-center`}
            >
              {isCreatingUsername ? (
                <ActivityIndicator size={"small"} color={"white"} />
              ) : (
                <Text className="font-mont text-white">Create username</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
