import * as Font from "expo-font";
import { useEffect, useState } from "react";

export function useFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          "SuisseIntl-Regular-WebM": require("../assets/fonts/SuisseIntl-Regular-WebM.ttf"),
          "SuisseIntl-Medium-WebM": require("../assets/fonts/SuisseIntl-Medium-WebM.ttf"),
          "SuisseIntl-Bold-WebM": require("../assets/fonts/SuisseIntl-Bold-WebM.ttf"),
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
