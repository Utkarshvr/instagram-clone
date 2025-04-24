import { View, Text, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { openGmail } from "@/utils/actions";

export default function VerifyEmailScreen() {
  return (
    <View className="bg-neutral-950 flex-1 items-center justify-center px-6">
      {/* Instagram Logo */}
      <Image
        source={require("@/assets/insta-dark.png")}
        style={{ width: 180, height: 60, objectFit: "contain" }}
        className="mb-6"
      />

      {/* Verification Message Box */}
      <View className="bg-neutral-900 p-6 rounded-2xl">
        <Text className="font-montBold text-2xl text-white text-center mb-4">
          Verify Your Email
        </Text>

        <Text className="font-montMedium text-base text-white text-center mb-6">
          We’ve sent a verification email to your inbox. Please check it to
          continue using Instagram.
        </Text>

        {/* Open Gmail Button */}
        <TouchableOpacity
          className="bg-white rounded-xl flex-row items-center justify-center py-3 px-4 mb-6"
          onPress={openGmail}
        >
          <MaterialCommunityIcons
            name="email-outline"
            size={20}
            color="black"
          />
          <Text className="text-black font-montSemiBold text-base ml-2">
            Open Gmail
          </Text>
        </TouchableOpacity>

        <Text className="font-montMedium text-sm text-white text-center">
          Didn’t get the email?{"\n"}Check your spam folder or tap below to
          resend.
        </Text>
      </View>

      {/* Resend Email Link */}
      <TouchableOpacity
        className="mt-6"
        onPress={() => {
          // Handle resend email logic here
        }}
      >
        <Text className="text-sky-500 font-montSemiBold text-base text-center">
          Resend Email
        </Text>
      </TouchableOpacity>
    </View>
  );
}
