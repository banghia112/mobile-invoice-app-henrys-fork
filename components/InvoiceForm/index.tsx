import { Feather } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SelectorProps {
  label: string;
  options: string[];
  onSelect: (value: string) => void;
  selectedValue: string | null;
}

const Selector: React.FC<SelectorProps> = ({
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
      <Text style={styles.selectorLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.selectorInput}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.selectorText}>
          {selectedValue ? selectedValue : `Select ${label}`}
        </Text>
        <Feather
          name="chevron-down"
          size={20}
          color="#CBD5E0"
          style={styles.icon}
        />
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

interface InvoiceScreenProps {
  type: "new" | "edit";
}

export const InvoiceForm: React.FC<InvoiceScreenProps> = ({ type }) => {
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [paymentTerm, setPaymentTerm] = useState<string | null>(null);
  const [billingCountry, setBillingCountry] = useState<string | null>(null);
  const [shippingCountry, setShippingCountry] = useState<string | null>(null);

  const paymentTermOptions = ["Net 15 Days", "Net 30 Days", "Due on Receipt"];
  const countryOptions = [
    "United Kingdom",
    "United States",
    "Canada",
    "Australia",
  ];

  const onChangeInvoiceDate = (
    _event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    const currentDate = selectedDate || invoiceDate;
    setShowDatePicker(Platform.OS === "ios"); // Hide picker on iOS once selected
    setInvoiceDate(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handlePaymentTermSelect = (term: string) => {
    setPaymentTerm(term);
    console.log("Selected Payment Term:", term);
    // Logic to calculate due date based on the term
  };

  const handleBillingCountrySelect = (country: string) => {
    setBillingCountry(country);
    console.log("Billing Country:", country);
  };

  const handleShippingCountrySelect = (country: string) => {
    setShippingCountry(country);
    console.log("Shipping Country:", country);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Invoice Date</Text>
      <TouchableOpacity onPress={showDatepicker} style={styles.input}>
        <Text>{invoiceDate.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          testID="invoiceDatePicker"
          value={invoiceDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChangeInvoiceDate}
          c
        />
      )}

      <Selector
        label="Payment Terms"
        options={paymentTermOptions}
        onSelect={handlePaymentTermSelect}
        selectedValue={paymentTerm}
      />

      {/* Bill From Section */}
      <Text style={styles.sectionTitle}>Bill From</Text>
      <Selector
        label="Country"
        options={countryOptions}
        onSelect={handleBillingCountrySelect}
        selectedValue={billingCountry}
      />

      <Text style={styles.sectionTitle}>Bill To</Text>
      <Selector
        label="Country"
        options={countryOptions}
        onSelect={handleShippingCountrySelect}
        selectedValue={shippingCountry}
      />

      {/* ... Item List and other sections ... */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#1E293B",
  },
  label: {
    color: "#CBD5E0",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#334155",
    color: "#CBD5E0",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  sectionTitle: {
    color: "#F0F4F8",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  selectorContainer: {
    marginBottom: 15,
  },
  selectorLabel: {
    color: "#CBD5E0",
    marginBottom: 5,
  },
  selectorInput: {
    backgroundColor: "#334155",
    color: "#CBD5E0",
    padding: 10,
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
