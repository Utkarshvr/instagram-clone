import { useEffect, useState } from "react";
import { View } from "react-native";
import PostCard from "@/components/core/card/PostCard";
import LoadingScreen from "@/screens/common/LoadingScreen";
import { PostType } from "@/types/supabase-schema-types";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams, useNavigation } from "expo-router";
import ErrorScreen from "@/screens/common/ErrorScreen";

export default function PostDetails() {
  const { post_id } = useLocalSearchParams();
  const [post, setPost] = useState<PostType | null>(null);
  const [isFetchingPost, setIsFetchingPost] = useState(false);

  const fetchPosts = async () => {
    setIsFetchingPost(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*, profile:profiles(id, username, avatar)")
      .eq("id", post_id)
      .maybeSingle();

    if (error) {
      // console.log(error);
    }
    setPost(data as PostType);
    setIsFetchingPost(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const navigation = useNavigation();
  useEffect(() => {
    if (post) {
      navigation.setOptions({
        title: post.profile.username,
      });
    }
  }, [post]);

  if (isFetchingPost) return <LoadingScreen />;
  if (!post) return <ErrorScreen message="Post not found" />;

  return (
    <View className="flex-1 bg-neutral-950">
      <PostCard post={post} />
    </View>
  );
}
