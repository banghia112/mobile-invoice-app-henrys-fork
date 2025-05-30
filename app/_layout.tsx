import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Appearance, SafeAreaView, StyleSheet } from "react-native";
import "react-native-reanimated";

import { CustomHeader } from "@/components/CustomHeader";
import { useColorScheme } from "@/hooks/useColorScheme";
import invoiceService from "@/service/invoice.service";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpartanBold: require("../assets/fonts/LeagueSpartan-Bold.ttf"),
    SpartanMedium: require("../assets/fonts/LeagueSpartan-Medium.ttf"),
    SpartanRegular: require("../assets/fonts/LeagueSpartan-Regular.ttf"),
  });

  useEffect(() => {
    Appearance.setColorScheme("light");
    const setupInitialData = async () => {
      await invoiceService.initialize();
    };
    setupInitialData();

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      console.log("Color scheme changed:", colorScheme);
    });

    return () => subscription.remove();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            header: () => <CustomHeader colorScheme={colorScheme} />,
            title: "",
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="invoices" />
          <Stack.Screen name="invoices/new" />
          <Stack.Screen name="invoices/:id" />
          <Stack.Screen name="invoices/:id/edit" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
