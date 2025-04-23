import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, useNavigation } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { ProfileType } from "@/types/supabase-schema-types";
import LoadingScreen from "../common/LoadingScreen";
import { useSessionStore } from "@/store/SessionStore";
import ErrorScreen from "../common/ErrorScreen";
type Props = {
  profile_id: string | null | undefined;
};

const ProfileScreen = ({ profile_id }: Props) => {
  const { profile: MyProfile } = useSessionStore();

  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const [profile, setProfile] = useState<ProfileType | null>(null);

  const fetchProfile = async () => {
    setIsFetchingProfile(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", profile_id)
      .single();

    if (error) return console.log(error);

    setProfile(data);
    setIsFetchingProfile(false);
  };

  useEffect(() => {
    if (!profile_id) return console.log("No profile id");

    fetchProfile();
  }, [profile_id]);

  const isLoading = isFetchingProfile;
  const isMyProfile = profile_id === MyProfile?.id;

  const navigation = useNavigation();
  useEffect(() => {
    if (profile)
      navigation.setOptions({
        headerTitle: profile.username,
      });
    else
      navigation.setOptions({
        headerTitle: "",
      });
  }, [navigation, profile]);

  // Handle Errors & Loading
  if (!profile_id) return <ErrorScreen message="No profile id" />;
  if (isLoading) return <LoadingScreen message="Fetching profile..." />;
  if (!profile) return <ErrorScreen message="Profile not found" />;

  // Main Render
  return (
    <ScrollView
      className="bg-neutral-950 flex-1"
      // contentContainerStyle={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={fetchProfile} />
      }
    >
      {/* Accept Request */}
      {/* {isReqReceived && (
        <View className="p-4 border-t border-b border-neutral-800 gap-4 items-center">
          <View className="flex-row gap-1 items-center">
            <Ionicons name="person-add-outline" size={12} color={"#fafafa"} />

            <Text className="text-neutral-50 font-montserratSemiBold text-sm">
              <Text className="font-montserratBold">{user?.username}</Text>{" "}
              wants to follow you
            </Text>
          </View>
          <View className="flex-row gap-4 items-center">
            <TouchableOpacity onPress={acceptReq}>
              <View className={`bg-sky-500 py-2 px-8 rounded-md items-center`}>
                {isConfirmBtnDisabled ? (
                  <ActivityIndicator size={"small"} />
                ) : (
                  <Text className="font-montserratSemiBold text-sm text-neutral-50">
                    Confirm
                  </Text>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={deleteReq}>
              <View
                className={`bg-neutral-800 py-2 px-8 rounded-md items-center`}
              >
                {isCancelBtnDisabled ? (
                  <ActivityIndicator size={"small"} />
                ) : (
                  <Text className="font-montserratSemiBold text-sm  text-neutral-50">
                    Delete
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )} */}

      <View className="w-full gap-4 p-4">
        <View className="w-full justify-between gap-2 flex-row items-center">
          <Image
            className="border-neutral-300 border rounded-full w-[80px] h-[80px]"
            source={
              profile?.avatar?.publicUrl
                ? { uri: profile.avatar.publicUrl }
                : require("@/assets/images/person.png")
            }
          />

          {/* <View className="flex-row gap-4">
            {hasAccess && (
              <TouchableOpacity className="gap-1 items-center">
                <Text className="text-neutral-200 font-montserrat">
                  {Posts.length}
                </Text>
                <Text className="text-neutral-400 font-montserratSemiBold">
                  Posts
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity className="gap-1 items-center">
              <Text className="text-neutral-200 font-montserrat">
                {userFollowers.length}
              </Text>
              <Text className="text-neutral-400 font-montserratSemiBold">
                Followers
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="gap-1 items-center">
              <Text className="text-neutral-200 font-montserrat">
                {userFollowing.length}
              </Text>
              <Text className="text-neutral-400 font-montserratSemiBold">
                Following
              </Text>
            </TouchableOpacity>
          </View> */}
        </View>
        <View>
          <View className="gap-1">
            <Text className="font-montSemiBold text-neutral-100">
              {profile?.name}
            </Text>
            <Text className="font-mont text-neutral-100 max-w-[80%]">
              {profile?.bio}
            </Text>
          </View>
        </View>

        {
          isMyProfile ? (
            <Link asChild href={"/edit-profile"}>
              <TouchableOpacity>
                <View
                  className={`bg-neutral-700 p-2 rounded-md w-full items-center`}
                >
                  <Text className="font-mont text-white">Edit Profile</Text>
                </View>
              </TouchableOpacity>
            </Link>
          ) : null
          // <TouchableOpacity
          // // onPress={
          // //   hasRequested
          // //     ? removeFollowReq
          // //     : isFollowed
          // //     ? unfollowTargetUser
          // //     : followUser
          // // }
          // >
          //   <View
          //     className={`${
          //       isBtnDisabled
          //         ? "bg-neutral-500"
          //         : hasRequested || isFollowed
          //         ? "bg-neutral-600"
          //         : "bg-sky-500"
          //     } p-2 rounded-md w-full items-center`}
          //   >
          //     {isBtnDisabled ? (
          //       <ActivityIndicator size={"large"} />
          //     ) : (
          //       <Text className="font-montserrat text-neutral-50">
          //         {hasRequested
          //           ? "Requested"
          //           : isFollowed
          //           ? "Following"
          //           : "Follow"}
          //       </Text>
          //     )}
          //   </View>
          // </TouchableOpacity>
        }
      </View>

      {/* <View className="w-full flex flex-row flex-wrap">
        {!isFetchingPosts &&
          Posts &&
          Posts.map((post) => (
            <PostCard key={post.id} post={post} isFeatured />
          ))}
        {!isFetchingPosts && !hasAccess && (
          <View className="flex flex-row gap-2 m-auto">
            <Ionicons name="lock-closed-outline" color={"#737373"} size={16} />
            <Text className="font-montserrat text-sm text-neutral-500">
              This is a private account, follow to see posts!
            </Text>
          </View>
        )}
      
      </View> */}
    </ScrollView>
  );
};

export default ProfileScreen;
