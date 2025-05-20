import { IconArrowDown } from "@/assets/svg";
import { colors } from "@/constants/Colors";
import { useMemo, useState } from "react";
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

  const handleSelect = (item: SelectorOption<T>) => {
    onSelect(item.value);
    setIsModalVisible(false);
  };

  const getItemLabel = (item: SelectorOption<T>): string => {
    return item.label;
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: SelectorOption<T>;
    index: number;
  }) => {
    const onPress = () => {
      onSelect(item.value);
      setIsModalVisible(false);
    };
    return (
      <Pressable
        style={{ padding: 12, borderColor: "white", borderWidth: 1 }}
        onPress={onPress}
      >
        <TypoGraphy variant="h3">{item.label}</TypoGraphy>
      </Pressable>
    );
  };

  const selectedLabel = useMemo(() => {
    return options.find((opt) => opt.value === selectedValue)?.label ?? "";
  }, [selectedValue]);

  return (
    <View style={styles.selectorContainer}>
      <TypoGraphy variant="body1" style={{ marginBottom: 8 }}>
        {label}
      </TypoGraphy>
      <Pressable
        style={styles.selectorInput}
        onPress={() => setIsModalVisible(true)}
      >
        <TypoGraphy variant="body1">{selectedLabel}</TypoGraphy>
        <IconArrowDown />
      </Pressable>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => `${item.value}`}
              renderItem={renderItem}
            />
            <Pressable
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <TypoGraphy>Close</TypoGraphy>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: "#CBD5E0",
    marginBottom: 5,
  },
  sectionTitle: {
    color: "#F0F4F8",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  selectorContainer: {
    marginBottom: 16,
  },
  selectorLabel: {
    color: "#CBD5E0",
    marginBottom: 5,
  },
  selectorInput: {
    backgroundColor: colors.black[200],
    color: "#CBD5E0",
    padding: 16,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectorText: {
    color: "#CBD5E0",
  },
  icon: {
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#263238",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#37474F",
  },
  optionText: {
    color: "#ECEFF1",
  },
  closeButton: {
    backgroundColor: "#455A64",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: "#ECEFF1",
    fontWeight: "bold",
  },
});
