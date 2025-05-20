import { colors } from "@/constants/Colors";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { TypoGraphy } from "../TypoGraphy";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  keyboardType,
  editable = true,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label && (
        <TypoGraphy variant="body1" style={styles.label}>
          {label}
        </TypoGraphy>
      )}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          editable ? {} : { backgroundColor: colors.black[100] },
        ]}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        keyboardType={keyboardType}
        editable={editable}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
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
