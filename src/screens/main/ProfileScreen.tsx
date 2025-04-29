import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Href, Link, router, useNavigation, useSegments } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { ProfileType } from "@/types/supabase-schema-types";
import LoadingScreen from "../common/LoadingScreen";
import { useSessionStore } from "@/store/SessionStore";
import ErrorScreen from "../common/ErrorScreen";
import { FollowButton } from "@/components/core/FollowBtn";
import FriendRequestButton from "@/components/core/FriendRequestButton";
import ProfilePictureModal from "@/components/core/modal/ProfilePictureModal";
import ProfilePostFeed from "@/components/core/ProfilePostFeed";
type Props = {
  profile_id: string | null | undefined;
};

type ExtendedProfileType = ProfileType & {
  no_of_followers: number;
  no_of_following: number;
  no_of_posts: number;
};

const ProfileScreen = ({ profile_id }: Props) => {
  const { profile: MyProfile } = useSessionStore();

  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const [profile, setProfile] = useState<ExtendedProfileType | null>(null);
  const [hasReceivedFollowRequest, setHasReceivedFollowRequest] =
    useState(false);
  const [
    doesCurrentUserFollowTargetProfile,
    setDoesCurrentUserFollowTargetProfile,
  ] = useState({ isLoading: true, isFollowing: false });

  const isMe = profile_id === MyProfile?.id;

  const fetchProfile = async () => {
    try {
      setIsFetchingProfile(true);

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profile_id)
        .single();

      if (profileError) {
        console.error("Error fetching profile", profileError);
        return;
      }

      // Fetch follow counts from view
      const { data: followCountsData, error: followCountsError } =
        await supabase
          .from("profile_counts")
          .select("no_of_followers, no_of_following, no_of_posts")
          .eq("profile_id", profile_id)
          .single();

      if (followCountsError) {
        console.error("Error fetching follow counts", followCountsError);
        return;
      }

      const fullProfile = {
        ...profileData,
        no_of_followers: followCountsData?.no_of_followers ?? 0,
        no_of_following: followCountsData?.no_of_following ?? 0,
        no_of_posts: followCountsData?.no_of_posts ?? 0,
      };

      setProfile(fullProfile);
    } catch (err) {
      console.error("Something went wrong fetching profile", err);
    } finally {
      setIsFetchingProfile(false);
    }
  };

  async function checkFollowRequestStatus() {
    const { data, error } = await supabase
      .from("follows")
      .select("followed_at")
      .eq("follower_id", profile_id)
      .eq("following_id", MyProfile?.id)
      .eq("status", "pending")
      .single();

    // console.log({ data, error });
    if (data) setHasReceivedFollowRequest(true);
  }

  async function checkIfCurrentUserFollowsTargetProfile() {
    setDoesCurrentUserFollowTargetProfile({
      isLoading: true,
      isFollowing: false,
    });
    const { data } = await supabase
      .from("follows")
      .select("status")
      .eq("follower_id", MyProfile?.id)
      .eq("following_id", profile_id)
      .eq("status", "accepted")
      .maybeSingle();

    if (data)
      setDoesCurrentUserFollowTargetProfile({
        isLoading: false,
        isFollowing: true,
      });
    else
      setDoesCurrentUserFollowTargetProfile({
        isLoading: false,
        isFollowing: false,
      });
  }

  const onRefresh = () => {
    fetchProfile();
    checkFollowRequestStatus();
    checkIfCurrentUserFollowsTargetProfile();
  };

  useEffect(() => {
    if (!profile_id) return; // console.log("No profile id");

    onRefresh();
  }, [profile_id]);

  const isLoading = isFetchingProfile;
  const isMyProfile = profile_id === MyProfile?.id;

  const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] =
    useState(false);
  const showProfilePicture = () => {
    setIsProfilePictureModalOpen(true);
  };

  const navigation = useNavigation();

  useEffect(() => {
    if (profile) {
      navigation.setOptions({
        title: profile?.username,
      });
    }
  }, [navigation, profile]);

  const segments = useSegments();
  const thirdSegment = segments[2];

  // Handle Errors & Loading
  if (isLoading) return <LoadingScreen message="Fetching profile..." />;
  if (!profile_id || !MyProfile) return <ErrorScreen message="No profile id" />;
  if (!profile) return <ErrorScreen message="Profile not found" />;

  // Main Render
  return (
    <ScrollView
      className="bg-neutral-950 flex-1"
      // contentContainerStyle={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
      }
    >
      {/* Accept Request */}
      {hasReceivedFollowRequest && (
        <View className="p-4 border-t border-b border-neutral-800 gap-4 items-center">
          <View className="flex-row gap-1 items-center">
            <Ionicons name="person-add-outline" size={12} color={"#fafafa"} />

            <Text className="text-neutral-50 font-montserratSemiBold text-sm">
              <Text className="font-montserratBold">{profile?.username}</Text>{" "}
              wants to follow you
            </Text>
          </View>
          <FriendRequestButton
            senderId={profile.id}
            receiverId={MyProfile.id}
            onRespond={() => setHasReceivedFollowRequest(false)}
          />
        </View>
      )}

      <View className="w-full gap-4 p-4">
        <View className="w-full justify-between gap-2 flex-row items-center">
          <TouchableOpacity onPress={showProfilePicture}>
            <Image
              className="border-neutral-300 border rounded-full w-[80px] h-[80px]"
              source={
                profile?.avatar?.publicUrl
                  ? { uri: profile.avatar.publicUrl }
                  : require("@/assets/images/person.png")
              }
            />
          </TouchableOpacity>

          {/* Posts, Followers, Following */}
          <View className="flex-row gap-4">
            <View className="gap-1 items-center">
              <Text className="text-neutral-200 font-montserrat">
                {profile?.no_of_posts}
              </Text>
              <Text className="text-neutral-400 font-montserratSemiBold">
                Posts
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname:
                    thirdSegment === "home"
                      ? "/(private)/(tabs)/home/profile/follow-list"
                      : "/(private)/(tabs)/profile/follow-list",
                  params: {
                    profile_id: profile.id,
                  },
                })
              }
              className="gap-1 items-center"
            >
              <Text className="text-neutral-200 font-montserrat">
                {profile?.no_of_followers}
              </Text>
              <Text className="text-neutral-400 font-montserratSemiBold">
                Followers
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname:
                    thirdSegment === "home"
                      ? "/(private)/(tabs)/home/profile/follow-list/following"
                      : "/(private)/(tabs)/profile/follow-list/following",
                  params: {
                    profile_id: profile.id,
                  },
                })
              }
              className="gap-1 items-center"
            >
              <Text className="text-neutral-200 font-montserrat">
                {profile?.no_of_following}
              </Text>
              <Text className="text-neutral-400 font-montserratSemiBold">
                Following
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <View className="gap-1">
            {profile?.name && (
              <Text className="font-montSemiBold text-neutral-100">
                {profile?.name}
              </Text>
            )}
            {profile?.bio && (
              <Text className="font-mont text-neutral-100 max-w-[80%]">
                {profile?.bio}
              </Text>
            )}
          </View>
        </View>

        {isMyProfile ? (
          <Link asChild href={"/edit-profile"}>
            <TouchableOpacity>
              <View
                className={`bg-neutral-700 p-2 rounded-md w-full items-center`}
              >
                <Text className="font-mont text-white">Edit Profile</Text>
              </View>
            </TouchableOpacity>
          </Link>
        ) : (
          <FollowButton
            targetUserId={profile.id}
            is_account_private={profile.is_account_private}
          />
        )}
      </View>

      {/* Posts */}
      {!doesCurrentUserFollowTargetProfile.isLoading &&
      !isMe &&
      profile.is_account_private &&
      !doesCurrentUserFollowTargetProfile.isFollowing ? (
        <View className="flex flex-row gap-2 m-auto">
          <Ionicons name="lock-closed-outline" color={"#737373"} size={16} />
          <Text className="font-montserrat text-sm text-neutral-500">
            This is a private account, follow to see posts!
          </Text>
        </View>
      ) : (
        <ProfilePostFeed profileId={profile.id} />
      )}

      {isProfilePictureModalOpen && (
        <ProfilePictureModal
          isOpen={isProfilePictureModalOpen}
          onClose={() => setIsProfilePictureModalOpen(false)}
          profilePicture={profile?.avatar?.publicUrl}
        />
      )}
    </ScrollView>
  );
};

export default ProfileScreen;
