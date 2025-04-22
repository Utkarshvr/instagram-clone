// import { useAppearanceSchemeStore } from "@/store/AppearanceSchemeStore";
// import { Tabs } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { Colors } from "react-native-ui-lib";

// // Strict typing for Ionicon names (you can extend this as needed)
// type IoniconName =
//   | "home"
//   | "home-outline"
//   | "calendar"
//   | "calendar-outline"
//   | "images"
//   | "images-outline"
//   | "document-text"
//   | "document-text-outline"
//   | "settings"
//   | "settings-outline";

// // Tab config type
// type TabItem = {
//   name: string;
//   icon: IoniconName;
//   iconOutline: IoniconName;
// };

// // Tab config array
// const tabs: TabItem[] = [
//   { name: "home", icon: "home", iconOutline: "home-outline" },
//   { name: "calendar", icon: "calendar", iconOutline: "calendar-outline" },
//   { name: "photo-album", icon: "images", iconOutline: "images-outline" },
//   {
//     name: "notes",
//     icon: "document-text",
//     iconOutline: "document-text-outline",
//   },
//   {
//     name: "profile-settings",
//     icon: "settings",
//     iconOutline: "settings-outline",
//   },
// ];

// export default function TabNavigator() {
//   useAppearanceSchemeStore();

//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: Colors.$textDefault,
//         tabBarStyle: {
//           backgroundColor: Colors.$backgroundDefault,
//           borderTopWidth: 0,
//         },
//       }}
//       initialRouteName="home"
//     >
//       {tabs.map(({ name, icon, iconOutline }) => (
//         <Tabs.Screen
//           key={name}
//           name={name}
//           options={{
//             tabBarIcon: ({ color, focused, size }) => (
//               <Ionicons
//                 name={focused ? icon : iconOutline}
//                 size={size}
//                 color={color}
//               />
//             ),
//             tabBarLabel: "",
//           }}
//         />
//       ))}
//     </Tabs>
//   );
// }
