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
      .select("*, profile:profiles(id, username, avatar)");
    if (error) {
      console.log(error);
    }
    console.log(data);
    setPosts(data as PostType[]);
    setIsFetchingPost(false);
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isFetchingPost}
          onRefresh={fetchPosts}
        />
      }
    >
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </ScrollView>
  );
}
