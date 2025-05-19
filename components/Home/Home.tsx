import { IconPlus } from "@/assets/svg";
import { Button } from "@/components/Button";
import { ThemedText } from "@/components/ThemedText";
import { Link, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export const Home = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Button
        variant="primary"
        leadingComponent={
          <View
            style={{
              backgroundColor: "white",
              padding: 12,
              borderRadius: 100,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconPlus fontSize={24} />
          </View>
        }
        onPress={() => {
          router.push("/invoices/new");
        }}
      >
        <ThemedText>Test</ThemedText>
      </Button>
      <Link href="/invoices">View Invoice List</Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
