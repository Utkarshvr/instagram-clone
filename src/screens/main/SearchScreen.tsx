import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useSearchStore from "@/store/useSearchStore";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect } from "react";
import { useState } from "react";
import { ProfileType } from "@/types/supabase-schema-types";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
  const { text } = useSearchStore();
  const debouncedText = useDebounce(text, 500); // 500ms delay

  const [profiles, setProfiles] = useState<ProfileType[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!debouncedText) return;
      setIsSearching(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, name, avatar")
        .ilike("username", `%${debouncedText}%`);

      // console.log({ data });

      if (data) setProfiles(data as ProfileType[]);

      setIsSearching(false);
    };

    if (debouncedText.length === 0) {
      setProfiles([]);
      setIsSearching(false);
      return;
    }

    fetchUsers();
  }, [debouncedText]); // Run only when debouncedText changes

  return (
    <SafeAreaView className="bg-neutral-950 flex-1">
      {!isSearching && profiles.length > 0 && (
        <FlatList
          data={profiles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/explore/profile/[profile_id]",
                  params: { profile_id: item?.id },
                })
              }
              className="p-4 w-full"
              android_ripple={{ color: "#171717", borderless: false }}
              style={({ pressed }) => [
                {
                  opacity: pressed && Platform.OS === "ios" ? 0.5 : 1,
                },
              ]}
            >
              <View className="flex-row gap-2 items-center">
                <Image
                  className="border-neutral-300 border rounded-full w-[48px] h-[48px]"
                  source={
                    item?.avatar?.publicUrl
                      ? { uri: item.avatar.publicUrl }
                      : require("@/assets/images/person.png")
                  }
                />

                <View>
                  <Text className="text-neutral-100 font-montserratSemiBold">
                    {item.username}
                  </Text>

                  {item.name && (
                    <Text className="text-neutral-300 font-montserrat">
                      {item.name}
                    </Text>
                  )}
                </View>
              </View>
            </Pressable>
          )}
        />
      )}
      {!isSearching && text.length === 0 && (
        <Text className="p-4 text-neutral-400">
          Search for a user by username
        </Text>
      )}

      {isSearching ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size={"small"} color={"#fafafa"} />
        </View>
      ) : (
        text.length > 0 &&
        profiles.length === 0 && (
          <Text className="p-4 text-neutral-400">No users found</Text>
        )
      )}
    </SafeAreaView>
  );
}
