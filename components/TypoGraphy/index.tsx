import { colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";

interface TypoGraphyProps extends TextProps {
  variant?: "h1" | "h2" | "h3" | "h4" | "body1" | "body2";
  children: React.ReactNode;
}

export const TypoGraphy: React.FC<TypoGraphyProps> = ({
  variant = "body1",
  children,
  style,
  ...rest
}) => {
  const textStyles = StyleSheet.flatten([styles.base, styles[variant], style]);

  return (
    <Text style={textStyles} {...rest}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: "SpartanRegular",
    color: colors.white[200],
  },
  h1: {
    fontSize: 32,
    fontFamily: "SpartanBold",
    lineHeight: 32 * (1 + 1 / 32),
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "SpartanMedium",
    lineHeight: 20 * (1 + (1 / 20) * 0.63),
    letterSpacing: -0.315,
  },
  h3: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "SpartanMedium",
    lineHeight: 16 * (1 + (1 / 16) * 0.8),
    letterSpacing: -0.2,
  },
  h4: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "SpartanMedium",
    lineHeight: 12 * (1 + (1 / 12) * 0.25),
    letterSpacing: -0.0625,
  },
  body1: {
    fontSize: 15,
    lineHeight: 15 * (1 + (1 / 15) * 0.25),
    letterSpacing: -0.03125,
  },
  body2: {
    fontSize: 16,
    fontWeight: "normal",
    lineHeight: 16 * (1 + (1 / 16) * 0.23),
    letterSpacing: -0.036,
  },
});
