// hooks/useMediaPicker.ts
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

type UseMediaPickerOptions = {
  mediaTypes?: ImagePicker.MediaTypeOptions;
  allowsMultipleSelection?: boolean;
  selectionLimit?: number;
  allowsEditing?: boolean;
  quality?: number;
};

type UseMediaPickerReturn = {
  media: ImagePicker.ImagePickerAsset[];
  pickMedia: () => Promise<void>;
  clearAllMedia: () => void;
  removeMedia: (uri: string) => void;
};

export default function useMediaPicker({
  mediaTypes = ImagePicker.MediaTypeOptions.All,
  allowsMultipleSelection = true,
  selectionLimit = 5,
  allowsEditing = false,
  quality = 1,
}: ImagePicker.ImagePickerOptions = {}): UseMediaPickerReturn {
  const [media, setMedia] = useState<ImagePicker.ImagePickerAsset[]>([]);

  const pickMedia = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes,
        allowsMultipleSelection,
        selectionLimit,
        allowsEditing,
        quality,
      });

      if (!result.canceled && result.assets) {
        setMedia((prev) => {
          const newAssets = [...prev, ...result.assets];
          // ✨ Enforce the total limit manually
          return newAssets.slice(0, selectionLimit);
        });
      }
    } catch (error) {
      console.error("Media picking error:", error);
    }
  };

  const clearAllMedia = () => {
    setMedia([]);
  };

  const removeMedia = (uri: string) => {
    setMedia((prev) => prev.filter((item) => item.uri !== uri));
  };

  return {
    media,
    pickMedia,
    clearAllMedia,
    removeMedia,
  };
}
