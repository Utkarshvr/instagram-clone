import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Image, View, Dimensions, TouchableOpacity } from "react-native";
import { PostType } from "@/types/supabase-schema-types";

const screenWidth = Dimensions.get("window").width;

export default function ProfilePostFeed({ profileId }: { profileId: string }) {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [urls, setUrls] = useState<string[]>([]);

  const fetchPosts = async () => {
    // setIsFetchingPost(true);
    const { data, error } = await supabase
      .from("posts")
      .select("id, media")
      .eq("user_id", profileId);

    if (error) {
      console.log(error);
    }
    setPosts(data as PostType[]);
    // setIsFetchingPost(false);
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchUrls = async () => {
    const { data } = await supabase.storage.from("posts").createSignedUrls(
      posts.map((post) => post.media[0].path),
      60
    );
    setUrls(data?.map((d) => d.signedUrl) || []);
  };

  useEffect(() => {
    if (posts.length > 0) {
      fetchUrls();
    }
  }, [posts]);

  return (
    <View className="w-full flex-row flex-wrap gap-2">
      {urls.map((url) => (
        <TouchableOpacity
          key={url}
          //   onPress={() =>
          //     router.push({
          //       pathname: "/post/[postId]",
          //       params: {
          //         postId,
          //       },
          //     })
          //   }
        >
          <Image
            source={{ uri: url }}
            style={{ width: screenWidth / 3, height: screenWidth / 3 }}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}
