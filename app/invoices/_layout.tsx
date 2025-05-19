import { router, Slot } from "expo-router";
import "react-native-reanimated";

import { IconArrowLeft } from "@/assets/svg";
import { Button } from "@/components/Button";
import { TypoGraphy } from "@/components/TypoGraphy";
import { colors } from "@/constants/Colors";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.black[100] }}>
      <Button
        variant="primary"
        leadingComponent={
          <View
            style={{
              padding: 12,
              borderRadius: 100,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 16,
            }}
          >
            <IconArrowLeft fontSize={24} />
          </View>
        }
        onPress={() => {
          router.back();
        }}
        containerStyle={{ backgroundColor: colors.black[100] }}
      >
        <TypoGraphy variant="h2">Go Back</TypoGraphy>
      </Button>
      <Slot />
    </View>
  );
}
