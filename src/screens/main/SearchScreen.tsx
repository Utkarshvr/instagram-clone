import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
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

      console.log({ data });

      if (data) setProfiles(data as ProfileType[]);

      setIsSearching(false);
    };

    fetchUsers();
  }, [debouncedText]); // Run only when debouncedText changes

  return (
    <SafeAreaView className="bg-neutral-950 flex-1">
      {!isSearching && profiles.length > 0 ? (
        <FlatList
          data={profiles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/explore/profile/[profile_id]",
                  params: { profile_id: item?.id },
                })
              }
              className="p-4 w-full"
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

                  <Text className="text-neutral-300 font-montserrat">
                    {item.name}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text className="text-neutral-400">No users found</Text>
      )}
      {isSearching && (
        <Text className="text-neutral-300 font-montserratSemiBold">
          Searching...
        </Text>
      )}
    </SafeAreaView>
  );
}
