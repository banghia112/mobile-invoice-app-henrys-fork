import { IconArrowDown } from "@/assets/svg";
import { colors } from "@/constants/Colors";
import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TypoGraphy } from "../TypoGraphy";

interface SelectorProps {
  label: string;
  options: string[];
  onSelect: (value: string) => void;
  selectedValue: string | null;
}

export const Selector: React.FC<SelectorProps> = ({
  label,
  options,
  onSelect,
  selectedValue,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSelect = (item: string) => {
    onSelect(item);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.selectorContainer}>
      <TypoGraphy variant="body1" style={{ marginBottom: 8 }}>
        {label}
      </TypoGraphy>
      <Pressable
        style={styles.selectorInput}
        onPress={() => setIsModalVisible(true)}
      >
        <TypoGraphy variant="body1">
          {selectedValue ? selectedValue : `Select ${label}`}
        </TypoGraphy>
        <IconArrowDown />
      </Pressable>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </Pressable>
              )}
            />
            <Pressable
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
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
