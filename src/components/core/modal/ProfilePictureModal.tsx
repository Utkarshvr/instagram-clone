import { Modal, Pressable } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

export default function ProfilePictureModal({
  isOpen,
  onClose,
  profilePicture,
}: {
  isOpen: boolean;
  onClose: () => void;
  profilePicture: string;
}) {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Pinch gesture
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = e.scale;
    })
    .onEnd(() => {
      scale.value = withTiming(1, { duration: 200 });
    });

  // Pan gesture (any direction = close)
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd((e) => {
      const distance = Math.sqrt(e.translationX ** 2 + e.translationY ** 2);
      if (distance > 100) {
        runOnJS(onClose)();
      } else {
        translateX.value = withTiming(0, { duration: 200 });
        translateY.value = withTiming(0, { duration: 200 });
      }
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Modal
      visible={isOpen}
      transparent
      onRequestClose={onClose}
      animationType="fade"
    >
      <GestureHandlerRootView
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.8)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Tap outside the image closes the modal */}
        <Pressable
          onPress={onClose}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <GestureDetector gesture={composedGesture}>
            <Animated.Image
              source={{ uri: profilePicture }}
              style={[
                {
                  width: 280,
                  height: 280,
                  borderRadius: 999,
                  borderWidth: 2,
                  borderColor: "#ccc",
                },
                animatedStyle,
              ]}
            />
          </GestureDetector>
        </Pressable>
      </GestureHandlerRootView>
    </Modal>
  );
}
