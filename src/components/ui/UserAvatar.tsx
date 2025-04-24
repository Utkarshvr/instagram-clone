import { Image } from "react-native";
import { ProfileType } from "@/types/supabase-schema-types";

type Props = {
  avatar: ProfileType["avatar"];
  size?: number;
};

export default function UserAvatar({ avatar, size = 36 }: Props) {
  return (
    <Image
      className={`border-neutral-300 border rounded-full`}
      style={{ width: size, height: size }}
      source={
        avatar?.publicUrl
          ? { uri: avatar.publicUrl }
          : require("@/assets/images/person.png")
      }
    />
  );
}
