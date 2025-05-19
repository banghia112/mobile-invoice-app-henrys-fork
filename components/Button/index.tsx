import { colors } from "@/constants/Colors";
import { ComponentProps, ReactNode } from "react";
import { Pressable, View, ViewStyle } from "react-native";

interface ButtonProps extends ComponentProps<typeof Pressable> {
  variant: "primary" | "secondary" | "danger";
  children: ReactNode;
  leadingComponent?: ReactNode;
  fullWidth?: boolean;
  onPress: () => void;
  containerStyle?: ViewStyle;
}

export const Button = ({
  variant = "primary",
  children,
  leadingComponent,
  fullWidth,
  containerStyle,
  ...props
}: ButtonProps) => {
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

  const variantStyle = getContainerVariantStyle(variant);

  return (
    <Pressable style={{ flexDirection: "row" }} {...props}>
      <View
        style={[
          {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: 8,
            minWidth: 100,
            justifyContent: leadingComponent ? "space-between" : "center",
            borderRadius: 100,
            ...variantStyle,
            ...containerStyle,
          },
          fullWidth ? { flex: 1 } : {},
        ]}
      >
        {leadingComponent && leadingComponent}
        <View
          style={{
            justifyContent: "center",
            flexDirection: "row",
            paddingVertical: 8,
            flexGrow: 1,
          }}
        >
          {children}
        </View>
      </View>
    </Pressable>
  );
};
