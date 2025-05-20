import { IconArrowDown } from "@/assets/svg";
import { colors } from "@/constants/Colors";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, View } from "react-native";
import { TypoGraphy } from "../TypoGraphy";

export interface SelectorOption<T> {
  label: string;
  value: T;
}

interface SelectorProps<T> {
  label: string;
  options: SelectorOption<T>[];
  onSelect: (value: T) => void;
  selectedValue: T | null | undefined;
  extractValue?: (item: SelectorOption<T>) => T;
}

export const Selector = <T,>({
  label,
  options,
  onSelect,
  selectedValue,
  extractValue,
}: SelectorProps<T>) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSelect = useCallback(
    (item: SelectorOption<T>) => {
      onSelect(item.value);
      setIsModalVisible(false);
    },
    [onSelect]
  );

  const renderItem = useCallback(
    ({ item }: { item: SelectorOption<T> }) => (
      <Pressable style={styles.option} onPress={() => handleSelect(item)}>
        <TypoGraphy variant="h3" style={styles.optionText}>
          {item.label}
        </TypoGraphy>
      </Pressable>
    ),
    [handleSelect]
  );

  const selectedLabel = useMemo(() => {
    return options.find((opt) => opt.value === selectedValue)?.label ?? "";
  }, [options, selectedValue]);

  const toggleModal = useCallback(() => {
    setIsModalVisible((prev) => !prev);
  }, []);

  return (
    <View style={styles.selectorContainer}>
      <TypoGraphy variant="body1" style={styles.selectorLabel}>
        {label}
      </TypoGraphy>
      <Pressable style={styles.selectorInput} onPress={toggleModal}>
        <TypoGraphy variant="body1" style={styles.selectorText}>
          {selectedLabel}
        </TypoGraphy>
        <IconArrowDown style={styles.icon} />
      </Pressable>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => `${item.value}`}
              renderItem={renderItem}
            />
            <Pressable style={styles.closeButton} onPress={toggleModal}>
              <TypoGraphy style={styles.closeButtonText}>Close</TypoGraphy>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selectorContainer: {
    marginBottom: 16,
  },
  selectorLabel: {
    color: colors.grey[300],
    marginBottom: 8,
  },
  selectorInput: {
    backgroundColor: colors.black[200],
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectorText: {
    color: colors.white[100],
  },
  icon: {
    marginLeft: 10,
    color: colors.white[100],
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: colors.black[100],
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  option: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.black[300],
  },
  optionText: {
    color: colors.white[100],
  },
  closeButton: {
    backgroundColor: colors.purple[200],
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: colors.white[100],
    fontWeight: "bold",
  },
});
