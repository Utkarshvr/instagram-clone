import { Text, TouchableOpacity, View } from "react-native";
import { PostType } from "@/types/supabase-schema-types";
import MediaCarousel from "../MediaCarousel";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { router, useSegments } from "expo-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Caption from "../Caption";
import UserAvatar from "@/components/ui/UserAvatar";

// Ensure dayjs plugin is loaded
dayjs.extend(relativeTime);

type CarouselMediaType = {
  uri: string;
  type: "image" | "video";
};

export default function PostCard({ post }: { post: PostType }) {
  const [media, setMedia] = useState<CarouselMediaType[]>([]);

  const fetchMedia = async () => {
    try {
      if (!post?.media || post.media.length === 0) return;

      const { data, error } = await supabase.storage
        .from("posts")
        .createSignedUrls(
          post.media.map((m) => m.path),
          60
        );

      if (error) {
        console.error("Supabase storage error:", error);
        return;
      }

      setMedia(
        (data ?? []).map(
          (d) =>
            ({
              uri: d.signedUrl,
              type: post.media?.find((m) => m.path === d.path)?.type || "image",
            } as CarouselMediaType)
        )
      );
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  };

  useEffect(() => {
    if (media.length === 0 && post?.media?.length) {
      fetchMedia();
    }
  }, [post]);

  const segments = useSegments();
  const thirdSegment = segments?.[2];

  const handleProfilePress = () => {
    try {
      const profilePath =
        thirdSegment === "home"
          ? "/(private)/(tabs)/home/profile/[profile_id]"
          : thirdSegment === "explore"
          ? "/(private)/(tabs)/explore/profile/[profile_id]"
          : "/(private)/(tabs)/profile";

      router.push({
        pathname: profilePath as any,
        params: { profile_id: post.profile?.id },
      });
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  if (!post || !post.profile) {
    return null; // Don't render if post data is incomplete
  }

  return (
    <View className="w-full rounded-lg overflow-hidden mb-4">
      <View className="flex-row items-center justify-between p-4">
        <TouchableOpacity
          onPress={handleProfilePress}
          className="flex-row items-center gap-2"
        >
          <UserAvatar avatar={post.profile.avatar} />
          <Text className="ml-3 text-neutral-50 font-montSemiBold">
            {post.profile.username}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="w-full">
        {post.media && media.length > 0 && <MediaCarousel media={media} />}
      </View>

      <View className="p-4">
        <View>
          <Caption
            caption={post.caption}
            link={{
              pathname: "/home/profile/[profile_id]",
              params: { profile_id: post.profile.id },
            }}
            profile={post.profile}
          />

          <Text className="text-neutral-500 text-sm">
            {post.created_at ? dayjs(post.created_at).fromNow() : ""}
          </Text>
        </View>
      </View>
    </View>
  );
}
