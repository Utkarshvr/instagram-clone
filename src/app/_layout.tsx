import "@/global.css";

import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { Slot } from "expo-router";
import { useFonts } from "@expo-google-fonts/montserrat";

// Initialization
import fonts from "@/config/theme/fonts";
import AuthHandler from "@/components/handlers/AuthHandler";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DeepLinking from "@/components/handlers/DeepLinking";
SplashScreen.preventAutoHideAsync();

export default function _layout() {
  const [fontsLoaded] = useFonts(fonts);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  return (
    <ActionSheetProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Slot />
        <AuthHandler />
        <DeepLinking />
      </GestureHandlerRootView>
    </ActionSheetProvider>
  );
}
