import { LogoIcon, MoonIcon, SunIcon } from "@/assets/svg";
import { colors } from "@/constants/Colors";
import { Link } from "expo-router";
import React from "react";
import {
  Appearance,
  ColorSchemeName,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

interface CustomHeaderProps {
  colorScheme: ColorSchemeName;
}

export const CustomHeader = ({ colorScheme }: CustomHeaderProps) => {
  const toggleColorScheme = () => {
    Appearance.setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: colors.purple[100],
          padding: 24,
          borderTopRightRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        <Link href="/" style={styles.logoContainer}>
          <LogoIcon width={24} height={24} />
        </Link>
      </View>

      <Pressable style={styles.colorSchemeButton} onPress={toggleColorScheme}>
        {colorScheme === "dark" ? (
          <SunIcon color="#fff" fontSize={24} />
        ) : (
          <MoonIcon color="#000" fontSize={24} />
        )}
      </Pressable>

      <Pressable style={styles.avatarContainer}>
        <Image
          source={require("../../assets/images/image-avatar.jpg")}
          style={styles.avatar}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.black[200],
  },
  logoContainer: {},
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  colorSchemeButton: {
    justifyContent: "flex-end",
    flex: 1,
    paddingRight: 16,
    flexDirection: "row",
  },
  avatarContainer: {
    padding: 16,
    borderLeftColor: colors.purple[100],
    borderLeftWidth: 0.5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
