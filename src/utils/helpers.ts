import { ToastAndroid } from "react-native";
import * as FileSystem from "expo-file-system";
import { supabase } from "@/lib/supabase";

export function toastMsg(msg: string) {
  ToastAndroid.showWithGravityAndOffset(
    msg,
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM,
    25,
    50
  );
}

export const uploadToSupabaseStorage = async (
  imageUri: string,
  userId: string,
  existingFilePath?: string
) => {
  if (!userId) return console.log("User ID is required");

  try {
    // 1. Delete previous avatar if exists
    if (existingFilePath) {
      const { error: deleteError, data } = await supabase.storage
        .from("public-bucket")
        .remove([existingFilePath]);

      console.log("Delete old avatar", { data, deleteError });

      if (deleteError) {
        console.warn("Failed to delete old avatar:", deleteError);
      } else {
        console.log("Old avatar deleted:", existingFilePath);
      }
    }

    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: "base64",
    });

    const fileExt = imageUri.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error, data } = await supabase.storage
      .from("public-bucket")
      .upload(filePath, decode(base64), {
        contentType: `image/${fileExt}`,
        upsert: true,
      });

    if (error) {
      console.error("Upload Error:", error);
      return null;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("public-bucket").getPublicUrl(filePath);

    return { publicUrl, ...data };
  } catch (error) {
    console.error("Upload Error:", error);
    return null;
  }
};

// Helper function to decode base64
const decode = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export function shortenString(str: string, maxLength: number) {
  let newStr = "";

  if (str.length > maxLength) {
    newStr = str.slice(0, maxLength) + "...";
  }

  return newStr;
}
