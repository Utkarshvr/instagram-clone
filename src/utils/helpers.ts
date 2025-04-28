import { ToastAndroid } from "react-native";
import * as FileSystem from "expo-file-system";
import { supabase } from "@/lib/supabase";
import { FileOptions } from "@supabase/storage-js/src/lib/types";

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
  if (!userId) return // console.log("User ID is required");

  try {
    // 1. Delete previous avatar if exists
    if (existingFilePath) {
      const { error: deleteError, data } = await supabase.storage
        .from("public-bucket")
        .remove([existingFilePath]);

      // console.log("Delete old avatar", { data, deleteError });

      if (deleteError) {
        console.warn("Failed to delete old avatar:", deleteError);
      } else {
        // console.log("Old avatar deleted:", existingFilePath);
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

// ✅ Single File Upload (Flexible)
export const uploadFileToSupabaseStorage = async (
  file: { uri: string; fileName: string; type?: string },
  path: { filePath: string; isReplacable?: boolean },
  bucketId: string,
  fileOptions?: FileOptions
) => {
  if (!file.uri) throw new Error("No URI found");

  try {
    const base64 = await FileSystem.readAsStringAsync(file.uri, {
      encoding: "base64",
    });

    const fileUint8Array = decode(base64);

    const filePath = path.isReplacable
      ? path.filePath.replace("__REPLACE__", `${file.fileName}-${Date.now()}`)
      : path.filePath;

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(bucketId)
      .upload(filePath, fileUint8Array, {
        contentType: file.type || "image/jpeg",
        ...fileOptions,
      });

    if (error) throw error;

    return { ...data, type: file.type };
  } catch (err) {
    console.error("Upload failed: ", err);
    throw err;
  }
};

// ✅ Multiple Files Upload (Flexible)
export const uploadMultipleFilesToSupabaseStorage = async (
  files: { uri: string; fileName: string; type?: string }[],
  path: { filePath: string; isReplacable: boolean },
  bucketId: string,
  fileOptions?: FileOptions
) => {
  const uploadPromises = files.map((file) =>
    uploadFileToSupabaseStorage(file, path, bucketId, fileOptions)
  );

  const results = await Promise.allSettled(uploadPromises);

  const successfulUploads = results
    .filter((res) => res.status === "fulfilled")
    .map(
      (res) =>
        (
          res as PromiseFulfilledResult<{
            id: string;
            path: string;
            fullPath: string;
            type: string;
          }>
        ).value
    );

  const failedUploads = results
    .filter((res) => res.status === "rejected")
    .map((res) => (res as PromiseRejectedResult).reason);

  return { successfulUploads, failedUploads };
};

export const getFileUrlFromSupabaseStorage = (
  filePath: string,
  bucketId: string
) => {
  const { data } = supabase.storage.from(bucketId).getPublicUrl(filePath);

  return data.publicUrl;
};
