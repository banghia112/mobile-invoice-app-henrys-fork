import { router, Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import "react-native-reanimated";

import { IconArrowLeft } from "@/assets/svg";
import { Button } from "@/components/Button";
import { TypoGraphy } from "@/components/TypoGraphy";
import { colors } from "@/constants/Colors";

const handleGoBack = () => {
  router.back();
};

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <Button
        variant="primary"
        leadingComponent={
          <View style={styles.iconContainer}>
            <IconArrowLeft fontSize={24} />
          </View>
        }
        onPress={handleGoBack}
        containerStyle={styles.buttonContainer}
      >
        <TypoGraphy variant="h2">Go Back</TypoGraphy>
      </Button>
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black[100],
  },
  iconContainer: {
    padding: 12,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  buttonContainer: {
    backgroundColor: colors.black[100],
  },
});
