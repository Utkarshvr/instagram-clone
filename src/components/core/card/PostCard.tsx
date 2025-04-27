import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PostType } from "@/types/supabase-schema-types";
import MediaCarousel from "../MediaCarousel";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import dayjs from "dayjs";

type CarouselMediaType = {
  uri: string;
  type: "image" | "video";
};

export default function PostCard({ post }: { post: PostType }) {
  const [media, setMedia] = useState<CarouselMediaType[]>([]);

  useEffect(() => {
    const fetchMedia = async () => {
      const { data, error } = await supabase.storage
        .from("posts")
        .createSignedUrls(
          post.media.map((m) => m.path),
          60
        );

      if (error) {
        console.log(error);
      }
      console.log({ data, error });

      setMedia(
        data?.map(
          (d) =>
            ({
              uri: d.signedUrl,
              type: post.media.find((m) => m.path === d.path)?.type || "image",
            } as CarouselMediaType)
        ) || []
      );
    };
    fetchMedia();
  }, [post]);

  return (
    <View className="w-full bg-neutral-900 rounded-lg overflow-hidden mb-4">
      {/* Header */}
      {
        <View className="flex-row items-center justify-between p-4">
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/home/profile/[profile_id]",
                params: { profile_id: post.profile.id },
              })
            }
            className="flex-row items-center gap-2"
          >
            <Image
              source={{ uri: post.profile.avatar.publicUrl }}
              className="h-8 w-8 rounded-full"
            />
            <Text className="ml-3 text-neutral-50 font-montSemiBold">
              {post.profile.username}
            </Text>
          </TouchableOpacity>
        </View>
      }

      {/* Media */}
      <View className="w-full aspect-square bg-neutral-800">
        {post.media && <MediaCarousel media={media} />}
      </View>

      {/* Footer */}
      <View className="p-4">
        <Text className="text-neutral-50 font-mont mb-2">
          <Text className="font-montSemiBold">{post.profile.username}</Text>{" "}
          {post.caption}
        </Text>
        <Text className="text-neutral-500 text-sm">
          {dayjs(post.created_at).fromNow()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
