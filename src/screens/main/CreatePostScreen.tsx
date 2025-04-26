import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import useMediaPicker from "@/hooks/useMediaPicker";
import MediaCarousel from "@/components/core/MediaCarousel";
import { useEffect, useState } from "react";

export default function CreatePostScreen() {
  const selectionLimit = 5;
  const { media, pickMedia, removeMedia } = useMediaPicker({
    mediaTypes: ["images", "videos"],
    selectionLimit,
    allowsMultipleSelection: true,
    allowsEditing: false,
    quality: 1,
  });

  const [postDetails, setPostDetails] = useState({
    caption: "",
  });

  useEffect(() => {
    pickMedia();
  }, []);

  return (
    <View className="flex-1 bg-neutral-950">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-neutral-900 rounded-lg overflow-hidden mb-6 mx-auto w-full min-h-[360px]">
          {media.length > 0 ? (
            <MediaCarousel
              media={media.map((m) => ({
                uri: m.uri,
                type: m.type === "image" ? "image" : "video",
              }))}
              isReadOnly={false}
              removeMedia={removeMedia}
            />
          ) : (
            <Text className="text-neutral-400 text-center my-auto">
              No media selected
            </Text>
          )}
        </View>

        <View className="px-4">
          <TouchableOpacity
            className="mb-6"
            onPress={pickMedia}
            disabled={media.length >= selectionLimit}
          >
            <Text
              className={`text-sky-500 text-center text-base font-montSemiBold ${
                media.length >= selectionLimit ? "opacity-50" : ""
              }`}
            >
              Add media
            </Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Write a caption..."
            placeholderTextColor="#9ca3af"
            multiline
            className="w-full rounded-md border-b border-b-neutral-600 text-neutral-50 font-mont"
            value={postDetails.caption}
            onChangeText={(text) =>
              setPostDetails({ ...postDetails, caption: text })
            }
          />
        </View>
      </ScrollView>

      <View className="px-6 py-4">
        <Pressable
          android_ripple={{ color: "rgba(255,255,255,0.2)" }}
          style={({ pressed }) => ({
            opacity: pressed && Platform.OS === "ios" ? 1 : 0.5,
          })}
          className="bg-sky-500 p-4 rounded-lg"
        >
          <Text className="text-center text-neutral-50 font-montSemiBold text-base">
            Upload
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
