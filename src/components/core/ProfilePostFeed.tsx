import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Image, View, Dimensions, TouchableOpacity } from "react-native";
import { PostType } from "@/types/supabase-schema-types";
import { router } from "expo-router";

const screenWidth = Dimensions.get("window").width;

export default function ProfilePostFeed({ profileId }: { profileId: string }) {
  const [posts, setPosts] = useState<(PostType & { url: string })[]>([]);

  const getUrls = async (givenPosts: PostType[]) => {
    const { data } = await supabase.storage.from("posts").createSignedUrls(
      givenPosts.map((p) => p.media[0].path),
      60
    );
    return data?.map((d) => d.signedUrl) || [];
  };

  const fetchPosts = async () => {
    if (posts.length > 0) return;

    // setIsFetchingPost(true);
    const { data, error } = await supabase
      .from("posts")
      .select("id, media")
      .eq("user_id", profileId)
      .order("created_at", { ascending: false });

    if (error) {
      return // console.log(error);
    }

    const urls = await getUrls(data as PostType[]);
    setPosts(
      (data as PostType[]).map((post, index) => ({
        ...post,
        url: urls[index],
      }))
    );
  };
  useEffect(() => {
    if (!profileId) return;
    fetchPosts();
  }, [profileId]);

  if (posts.length === 0) return null;

  return (
    <View className="w-full flex-row flex-wrap gap-2">
      {posts.map((post) => (
        <TouchableOpacity
          key={post.id}
          onPress={() =>
            router.push({
              pathname: "/profile/post/[post_id]",
              params: {
                post_id: post.id,
              },
            })
          }
        >
          <Image
            source={{ uri: post.url }}
            style={{ width: screenWidth / 3, height: screenWidth / 3 }}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}
