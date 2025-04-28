import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import useMediaPicker from "@/hooks/useMediaPicker";
import MediaCarousel from "@/components/core/MediaCarousel";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSessionStore } from "@/store/SessionStore";
import {
  toastMsg,
  uploadMultipleFilesToSupabaseStorage,
} from "@/utils/helpers";
import { router } from "expo-router";

export default function CreatePostScreen() {
  const { profile } = useSessionStore();

  const selectionLimit = 5;
  const { media, pickMedia, removeMedia, clearAllMedia } = useMediaPicker({
    mediaTypes: ["images", "videos"],
    selectionLimit,
    allowsMultipleSelection: true,
    allowsEditing: false,
    quality: 1,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [postDetails, setPostDetails] = useState({
    caption: "",
  });

  useEffect(() => {
    pickMedia();
  }, []);

  const handleUpload = async () => {
    if (media.length === 0) return // console.log("No media selected");

    setIsUploading(true);

    // console.log({ media });

    // Upload to supabase storage
    const uploadRes = await uploadMultipleFilesToSupabaseStorage(
      media.map((m) => ({
        uri: m.uri,
        fileName: m.fileName || "",
        type: m.type,
      })),
      { filePath: `${profile?.id}/__REPLACE__`, isReplacable: true },
      "posts"
    );
    // console.log({ uploadRes });

    if (uploadRes.failedUploads.length > 0) {
      // toastMsg("");
      // console.log(
      //   "The following files failed to upload: ",
      //   uploadRes.failedUploads
      // );
      // return setIsUploading(false);
    }

    if (uploadRes.successfulUploads.length === 0) {
      toastMsg("No media uploaded");
      toastMsg("There was an error uploading the media");
      router.canGoBack() ? router.back() : router.replace("/");
      return setIsUploading(false);
    }

    // Upload to supabase database

    const { error } = await supabase.from("posts").insert({
      caption: postDetails.caption,
      media: uploadRes.successfulUploads,
    });

    if (error) {
      setIsUploading(false);
      return // console.log(error);
    }
    setIsUploading(false);
    toastMsg("Post created successfully");

    // Reset State
    setPostDetails({ caption: "" });
    clearAllMedia();

    // Navigate to home
    router.canGoBack() ? router.back() : router.replace("/");
  };

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
            opacity: pressed && Platform.OS === "ios" ? 0.5 : 1,
          })}
          className={`${
            isUploading || media.length === 0 ? "opacity-50" : ""
          } bg-sky-500 p-4 rounded-lg `}
          onPress={handleUpload}
          disabled={isUploading || media.length === 0}
        >
          {isUploading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-center text-neutral-50 font-montSemiBold text-base">
              Upload
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
