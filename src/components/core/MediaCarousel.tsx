import { View, Image, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Carousel
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import { useRef, useState } from "react";
import Video from "./Video";

const screenWidth = Dimensions.get("window").width;

export default function MediaCarousel({
  media,
  width = screenWidth,
  height = screenWidth,
  isReadOnly = true,
  removeMedia,
}: {
  media: { uri: string; type: "image" | "video" }[];
  width?: number;
  height?: number;

  // Optional
  isReadOnly?: boolean;
  removeMedia?: (uri: string) => void;
}) {
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };

  const [containerWidth, setContainerWidth] = useState(0);

  return (
    <View className="relative">
      <Carousel
        data={media}
        ref={ref}
        width={width}
        height={width}
        loop={false}
        onProgressChange={progress}
        // onSnapToItem={(index) => setVideoSourceFunction(index)} // Track current index
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              borderWidth: 1,
              justifyContent: "center",
            }}
          >
            {item.type === "image" ? (
              <Image
                key={item.uri}
                source={{ uri: item.uri }}
                style={{
                  width: width,
                  height: width,
                  objectFit: "scale-down",
                }}
              />
            ) : (
              <Video source={item.uri} style={{ width, height }} />
            )}
          </View>
        )}
      />

      <View
        style={{
          position: "absolute",
          bottom: 36,
          left: "50%",
          transform: [{ translateX: -containerWidth / 2 }],
          backgroundColor: "rgba(0,0,0,0.5)",
          padding: 8,
          borderRadius: 100,

          display: isReadOnly && media.length === 1 ? "none" : "flex",
        }}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setContainerWidth(width);
        }}
      >
        <Pagination.Basic
          progress={progress}
          data={media}
          dotStyle={{ backgroundColor: "#fff", borderRadius: 100 }}
          activeDotStyle={{ backgroundColor: "#0ea5e9", borderRadius: 100 }}
          containerStyle={{ gap: 8 }}
          onPress={onPressPagination}
        />
      </View>

      {!isReadOnly && removeMedia && (
        <TouchableOpacity
          className="absolute top-4 left-4"
          onPress={() => removeMedia(media[progress.value].uri)}
        >
          <Ionicons
            name="close"
            size={24}
            color={"white"}
            className="bg-neutral-900 rounded-full p-2"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
