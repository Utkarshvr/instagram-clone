import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSessionStore } from "@/store/SessionStore";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Switch,
  TextInput,
} from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { capitalizeFirstLetter } from "@/utils/utils";
import { toastMsg, uploadToSupabaseStorage } from "@/utils/helpers";
import { supabase } from "@/lib/supabase";
import { ProfileType } from "@/types/supabase-schema-types";

export default function EditProfileScreen() {
  const { profile, setProfile } = useSessionStore();
  const navigation = useNavigation();
  const { showActionSheetWithOptions } = useActionSheet();

  const [form_value, setForm_value] = useState({
    name: profile?.name || "",
    username: profile?.username || "",
    email: profile?.email || "",
    avatar_url: profile?.avatar?.publicUrl || "",
    bio: profile?.bio || "",
    is_account_private: profile?.is_account_private || false,
  });

  const toggleSwitch = () =>
    setForm_value((prev) => ({
      ...prev,
      is_account_private: !prev.is_account_private,
    }));

  const thumbColor = form_value.is_account_private ? "#F0F8FF" : "#ffffff"; // AliceBlue when account is private, White when public

  const forms = ["name", "username", "bio"];

  const selectPicture = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const img = result.assets[0];
      // console.log({ uri: img.uri });
      setForm_value((prev) => ({ ...prev, avatar_url: img.uri }));
    }
  };

  const editPicture = () => {
    const options = ["New profile picture", "Remove current picture", "Cancel"];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex,
        cancelButtonIndex,
        useModal: true,
        containerStyle: {
          backgroundColor: "#262626",
        },
        textStyle: { color: "#fafafa" },
        cancelButtonTintColor: "#a3a3a3",
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            // New profile picture
            selectPicture();
            break;

          case destructiveButtonIndex:
            // Delete profile picture
            setForm_value((prev) => ({ ...prev, avatar_url: "" }));
            break;

          case cancelButtonIndex:
            // Cancel
            break;
        }
      }
    );
  };

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  async function updateProfile() {
    setIsUpdatingProfile(true);
    try {
      let uploadedAvatarData = profile?.avatar;
      if (form_value.avatar_url !== profile?.avatar?.publicUrl) {
        // Upload to Supabase Storage
        const data = await uploadToSupabaseStorage(
          form_value.avatar_url,
          profile?.id || "",
          profile?.avatar?.path || undefined
        );
        if (data) {
          uploadedAvatarData = data;
        }
      }

      // Update the user profile in Supabase
      const { error } = await supabase
        .from("profiles")
        .update({
          name: form_value.name,
          username: form_value.username,
          avatar: uploadedAvatarData,
          bio: form_value.bio,
          is_account_private: form_value.is_account_private,
        })
        .eq("id", profile?.id);

      if (error) {
        throw error;
      }

      // Update local state
      setProfile({
        ...profile,
        name: form_value.name,
        username: form_value.username,
        avatar: uploadedAvatarData,
        bio: form_value.bio,
        is_account_private: form_value.is_account_private,
      } as ProfileType);

      toastMsg("Profile updated");
      router.back();
    } catch (error) {
      console.log("Error updating profile: ", error);
    } finally {
      setIsUpdatingProfile(false);
    }
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity className="p-2" onPressIn={updateProfile}>
          {isUpdatingProfile ? (
            <ActivityIndicator size={"large"} color={"#0284c7"} />
          ) : (
            <Ionicons name={"checkmark"} size={24} color={"#0284c7"} />
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, form_value, isUpdatingProfile, updateProfile]);

  return (
    <SafeAreaView className="bg-neutral-950  flex-1 py-2">
      <ScrollView>
        <View className="items-center justify-center">
          <TouchableOpacity
            className="gap-2 items-center"
            onPress={editPicture}
          >
            <Image
              source={
                form_value.avatar_url
                  ? { uri: form_value.avatar_url }
                  : require("@/assets/images/person.png")
              }
              className="w-[80px] h-[80px] rounded-full"
            />

            <Text className="font-montserrat text-sm text-sky-600">
              Edit profile picture
            </Text>
          </TouchableOpacity>
        </View>
        <View className="px-4 gap-4">
          {forms.map((f) => (
            <View key={f}>
              <Text className="font-montserrat text-sm text-neutral-200">
                {capitalizeFirstLetter(f)}
              </Text>
              <TextInput
                onChangeText={(text) =>
                  setForm_value((prev) => ({ ...prev, [f]: text }))
                }
                multiline={f === "bio"}
                value={form_value[f as keyof typeof form_value] as string}
                className="w-full rounded-md text-neutral-100 font-montserrat border-b border-b-neutral-800"
                placeholder={`Enter ${f}`}
                placeholderTextColor={"#a3a3a3"}
              />
            </View>
          ))}
          <View className="flex flex-row gap-2 items-center justify-between">
            <Text className="font-montserrat text-sm text-neutral-200">
              {"Private account"}
            </Text>
            <Switch
              trackColor={{ false: "#A9A9A9", true: "#4682B4" }} // DarkGray when off, SteelBlue when on
              thumbColor={thumbColor}
              ios_backgroundColor="#A9A9A9"
              onValueChange={toggleSwitch}
              value={form_value.is_account_private}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
