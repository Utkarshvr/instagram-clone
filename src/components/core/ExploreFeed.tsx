import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import {
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { PostType } from "@/types/supabase-schema-types";
import { router } from "expo-router";
import LoadingScreen from "@/screens/common/LoadingScreen";

const screenWidth = Dimensions.get("window").width;

export default function ExploreFeed() {
  const [posts, setPosts] = useState<(PostType & { url: string })[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getUrls = async (givenPosts: PostType[]) => {
    const { data } = await supabase.storage.from("posts").createSignedUrls(
      givenPosts.map((p) => p.media[0].path),
      60
    );
    return data?.map((d) => d.signedUrl) || [];
  };

  const fetchPosts = async () => {
    if (posts.length > 0) return;

    setIsLoading(true);
    // setIsFetchingPost(true);
    const { data, error } = await supabase
      .from("posts")
      .select("id, media")
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
    setIsLoading(false);
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  if (isLoading) return <LoadingScreen />;
  if (posts.length === 0) return null;

  return (
    <ScrollView
      className="w-full "
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={fetchPosts} />
      }
      contentContainerStyle={{
        flex: 1,
        flexWrap: "wrap",
        flexDirection: "row",
      }}
    >
      {posts.map((post) => (
        <TouchableOpacity
          key={post.id}
          onPress={() =>
            router.push({
              pathname: "/explore/post/[post_id]",
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
    </ScrollView>
  );
}
