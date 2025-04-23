import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = { message: string };

const ErrorScreen = (props: Props) => {
  return (
    <View className="flex-1 justify-center items-center bg-neutral-950">
      <Ionicons name="alert-circle-outline" size={64} color="red" />
      <Text className="text-neutral-100 text-2xl font-montBold">Error</Text>
      <Text className="text-neutral-300 text-base font-mont">
        {props.message}
      </Text>
    </View>
  );
};

export default ErrorScreen;
