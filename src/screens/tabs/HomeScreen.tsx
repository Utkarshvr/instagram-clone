import { Button, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

type Props = {};

const HomeScreen = (props: Props) => {
  return (
    <View>
      <Text>HomeScreen</Text>
      <Button
        title="Edit Profile"
        onPress={() => router.push("/edit-profile")}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
