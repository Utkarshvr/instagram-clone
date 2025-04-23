import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Text, View, Dimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

const dimentions = Dimensions.get("window");

export default function SearchBar({
  pushToSearch = false,
}: {
  pushToSearch?: boolean;
}) {
  //   const { text, setText } = useSearchStore();

  return pushToSearch ? (
    <TouchableOpacity
      style={{ width: dimentions.width * 0.95 }}
      onPress={() => router.push("/explore/search")}
    >
      <View
        className={`bg-neutral-800 rounded-md px-4 py-2 flex-row gap-2 items-center w-full`}
      >
        <Ionicons name={"search-outline"} size={26} color={"white"} />
        <Text className="text-white font-mont">Search</Text>
      </View>
    </TouchableOpacity>
  ) : (
    <TextInput
      //   onChangeText={(txt) => setText(txt)}
      //   value={text}
      className="px-4 py-2 w-full rounded-md bg-neutral-800 text-neutral-50 font-mont"
      placeholder="Search a user"
      placeholderTextColor={"white"}
      autoCapitalize="none"
    />
  );
}
