import { Image } from "react-native";
import { StorageObject } from "@/types/supabase-schema-types";

export default function PostMedia({ media }: { media: StorageObject }) {
  return (
    <Image
      source={{ uri: media.publicUrl }}
      className="h-full w-full"
      resizeMode="cover"
    />
  );
}
