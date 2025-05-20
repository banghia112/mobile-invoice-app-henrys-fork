import { colors } from "@/constants/Colors";
import { formatDisplayDate } from "@/utils/formatter.utils";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TypoGraphy } from "../TypoGraphy";

interface InputProps {
  label?: string;
  error?: string;
  value: Date;
  onChange: (event: DateTimePickerEvent, date: Date | undefined) => void;
}

export const InputDatePicker: React.FC<InputProps> = ({
  label,
  value,
  error,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onPress = () => {
    setIsOpen(!isOpen);
  };

  const onChangeDate = (event: DateTimePickerEvent, date: Date | undefined) => {
    onChange(event, date);
    setIsOpen(false);
  };

  return (
    <View>
      <Pressable style={styles.container} onPress={onPress}>
        {label && (
          <TypoGraphy variant="body1" style={styles.label}>
            {label}
          </TypoGraphy>
        )}
        <View style={[styles.input, error && styles.inputError]}>
          <TypoGraphy variant="body2">
            {formatDisplayDate(value.toISOString())}
          </TypoGraphy>
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </Pressable>

      {isOpen ? (
        <DateTimePicker onChange={onChangeDate} value={value} />
      ) : (
        <></>
      )}
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
