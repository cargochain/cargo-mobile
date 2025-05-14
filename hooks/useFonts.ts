import * as Font from "expo-font";
import { useEffect, useState } from "react";

export function useFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          "Geist-Thin": require("../assets/fonts/Geist-Thin.ttf"),
          "Geist-ExtraLight": require("../assets/fonts/Geist-ExtraLight.ttf"),
          "Geist-Light": require("../assets/fonts/Geist-Light.ttf"),
          "Geist-Regular": require("../assets/fonts/Geist-Regular.ttf"),
          "Geist-Medium": require("../assets/fonts/Geist-Medium.ttf"),
          "Geist-SemiBold": require("../assets/fonts/Geist-SemiBold.ttf"),
          "Geist-Bold": require("../assets/fonts/Geist-Bold.ttf"),
          "Geist-ExtraBold": require("../assets/fonts/Geist-ExtraBold.ttf"),
          "Geist-Black": require("../assets/fonts/Geist-Black.ttf"),
        });
        setFontsLoaded(true);
        console.log("Fonts loaded");
      } catch (error) {
        console.error("Error loading fonts:", error);
        setFontsLoaded(true); // Set to true anyway to not block the app
      }
    }

    loadFonts();
  }, []);

  return fontsLoaded;
}
