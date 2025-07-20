import { Image, Text, TouchableOpacity, View } from "react-native";
import { PostType } from "@/types/supabase-schema-types";
import MediaCarousel from "../MediaCarousel";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link, router, useSegments } from "expo-router";
import dayjs from "dayjs";
import Caption from "../Caption";
import UserAvatar from "@/components/ui/UserAvatar";

type CarouselMediaType = {
  uri: string;
  type: "image" | "video";
};

export default function PostCard({ post }: { post: PostType }) {
  const [media, setMedia] = useState<CarouselMediaType[]>([]);

  const fetchMedia = async () => {
    const { data, error } = await supabase.storage
      .from("posts")
      .createSignedUrls(
        (post.media ?? [])?.map((m) => m.path),
        60
      );

    setMedia(
      (data ?? [])?.map(
        (d) =>
          ({
            uri: d.signedUrl,
            type:
              (post.media ?? []).find((m) => m.path === d.path)?.type ||
              "image",
          } as CarouselMediaType)
      ) || []
    );
  };

  useEffect(() => {
    if (media.length === 0) {
      fetchMedia();
    }
  }, [post]);

  const segments = useSegments();
  const thirdSegment = segments[2];

  return (
    <View className="w-full rounded-lg overflow-hidden mb-4">
      {/* Header */}
      {
        <View className="flex-row items-center justify-between p-4">
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname:
                  thirdSegment === "home"
                    ? "/(private)/(tabs)/home/profile/[profile_id]"
                    : thirdSegment === "explore"
                    ? "/(private)/(tabs)/explore/profile/[profile_id]"
                    : "/(private)/(tabs)/profile",
                params: { profile_id: post.profile.id },
              })
            }
            className="flex-row items-center gap-2"
          >
            <UserAvatar avatar={post.profile.avatar} />
            <Text className="ml-3 text-neutral-50 font-montSemiBold">
              {post.profile.username}
            </Text>
          </TouchableOpacity>
        </View>
      }

      {/* Media */}
      <View className="w-full">
        {post.media && <MediaCarousel media={media} />}
      </View>

      {/* Footer */}
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
            {dayjs(post.created_at).fromNow()}
          </Text>
        </View>
      </View>
    </View>
  );
}
