import { View, Text } from "react-native";

export default function VerifyEmailScreen() {
  return (
    <View className="bg-neutral-950 flex-1 items-center justify-center">
      <Text className="font-montBold text-2xl text-neutral-50">
        A verification email has been sent to your email address.
      </Text>
      <Text className="font-montMedium text-base text-neutral-50">
        Please verify your email to continue.
      </Text>
      <Text className="font-montMedium text-base text-neutral-50">
        If you did not receive an email, please check your spam folder.
      </Text>
    </View>
  );
}
