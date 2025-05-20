import { colors } from "@/constants/Colors";
import { formatDate } from "@/utils/formatter.utils";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TypoGraphy } from "../TypoGraphy";

interface InputProps {
  label?: string;
  error?: string;
  value: Date;
  onPress: () => void;
}

export const InputDatePicker: React.FC<InputProps> = ({
  label,
  value,
  error,
  onPress,
}) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      {label && (
        <TypoGraphy variant="body1" style={styles.label}>
          {label}
        </TypoGraphy>
      )}
      <View style={[styles.input, error && styles.inputError]}>
        <TypoGraphy variant="body2">
          {formatDate(value.toISOString())}
        </TypoGraphy>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    borderRadius: 5,
    padding: 16,
    fontSize: 16,
    color: "#fff",
    backgroundColor: colors.black[200],
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 3,
  },
});
