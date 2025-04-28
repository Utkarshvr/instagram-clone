import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { PostType } from "@/types/supabase-schema-types";
import PostCard from "./card/PostCard";

export default function HomePostsFeed() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isFetchingPost, setIsFetchingPost] = useState(false);

  const fetchPosts = async () => {
    setIsFetchingPost(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*, profile:profiles(id, username, avatar)")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
    }
    setPosts(data as PostType[]);
    setIsFetchingPost(false);
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  if (isFetchingPost) return null;

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isFetchingPost} onRefresh={fetchPosts} />
      }
    >
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </ScrollView>
  );
}
