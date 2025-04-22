// import { useEffect } from "react";
// import { useAppearanceSchemeStore } from "@/store/AppearanceSchemeStore";
// import { Appearance } from "react-native";

// export default function ThemeHandler() {
//   const { setColorScheme } = useAppearanceSchemeStore();

//   useEffect(() => {
//     const listener = Appearance.addChangeListener(({ colorScheme }) => {
//       setColorScheme(colorScheme);
//     });

//     return () => listener.remove();
//   }, []);

//   return null;
// }
