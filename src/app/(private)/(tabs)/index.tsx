import { Button, StyleSheet, Text, View } from "react-native";
import { supabase } from "@/lib/supabase";
type Props = {};

const index = (props: Props) => {
  return (
    <View>
      <Text>index</Text>
      <Button title="Logout" onPress={() => supabase.auth.signOut()} />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
