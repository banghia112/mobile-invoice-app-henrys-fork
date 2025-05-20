import { colors } from "@/constants/Colors";
import { ComponentProps, ReactNode } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

interface ButtonProps extends ComponentProps<typeof Pressable> {
  variant: "primary" | "secondary" | "danger";
  children: ReactNode;
  leadingComponent?: ReactNode;
  fullWidth?: boolean;
  onPress: () => void;
  containerStyle?: ViewStyle;
}

const getContainerVariantStyle = (
  variant: "primary" | "secondary" | "danger"
): ViewStyle => {
  switch (variant) {
    case "primary":
      return {
        backgroundColor: colors.purple[200],
      };
    case "secondary":
      return {
        backgroundColor: colors.white[200],
      };
    case "danger":
      return {
        backgroundColor: colors.red[100],
      };
    default:
      return {};
  }
};

export const Button = ({
  variant = "primary",
  children,
  leadingComponent,
  fullWidth,
  containerStyle,
  ...props
}: ButtonProps) => {
  const variantStyle = getContainerVariantStyle(variant);
  const justifyContentStyle = leadingComponent
    ? styles.spaced
    : styles.centered;
  const widthStyle = fullWidth ? styles.fullWidth : {};

  return (
    <Pressable style={styles.pressable} {...props}>
      <View
        style={[
          styles.container,
          justifyContentStyle,
          variantStyle,
          containerStyle,
          widthStyle,
        ]}
      >
        {leadingComponent && leadingComponent}
        <View style={styles.childrenContainer}>{children}</View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    flexDirection: "row",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    minWidth: 100,
    borderRadius: 100,
  },
  spaced: {
    justifyContent: "space-between",
  },
  centered: {
    justifyContent: "center",
  },
  fullWidth: {
    flex: 1,
  },
  childrenContainer: {
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: 8,
    flexGrow: 1,
  },
});
