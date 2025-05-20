import { IconDelete, IconPlus } from "@/assets/svg";
import { colors } from "@/constants/Colors";
import { generateInvoiceId } from "@/helper/invoice.helper";
import { Invoice, Item } from "@/service/invoice.service"; // Import types
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button } from "../Button";
import { Input } from "../Input";
import { InputDatePicker } from "../Input/InputDatePicker";
import { Selector } from "../Selector";
import { TypoGraphy } from "../TypoGraphy";

interface InvoiceFormProps {
  type: "new" | "edit";
  onSave: (
    invoiceData: Omit<Invoice, "id" | "createdAt" | "paymentDue" | "status">,
    status: "draft" | "pending"
  ) => void;
  initialInvoice?: Invoice;
}

const initialItem: Item = {
  name: "",
  quantity: 1,
  price: 0,
  total: 0,
};

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  type,
  onSave,
  initialInvoice,
}) => {
  const isEdit = type === "edit" && initialInvoice;
  const [invoiceId] = useState<string | undefined>(
    isEdit ? initialInvoice?.id : generateInvoiceId()
  );
  const [createdAt] = useState<Date>(
    isEdit && initialInvoice?.createdAt
      ? new Date(initialInvoice.createdAt)
      : new Date()
  );
  const [invoiceDate, setInvoiceDate] = useState<Date>(
    isEdit && initialInvoice?.createdAt
      ? new Date(initialInvoice.createdAt)
      : new Date()
  );
  const [paymentTerm, setPaymentTerm] = useState<number | null>(
    isEdit ? initialInvoice?.paymentTerms : null
  );
  const [paymentDue, setPaymentDue] = useState<Date | undefined>(
    type === "edit" && initialInvoice?.paymentDue
      ? new Date(initialInvoice.paymentDue)
      : undefined
  );
  const [lineItems, setLineItems] = useState<Array<Item>>(
    type === "edit" ? initialInvoice?.items || [initialItem] : [initialItem]
  );
  const [billFromStreet, setBillFromStreet] = useState<string>(
    isEdit ? initialInvoice?.senderAddress.street : ""
  );
  const [billFromCity, setBillFromCity] = useState<string>(
    isEdit ? initialInvoice?.senderAddress.city : ""
  );
  const [billFromPostcode, setBillFromPostcode] = useState<string>(
    isEdit ? initialInvoice?.senderAddress.postCode : ""
  );
  const [billFromCountry, setBillFromCountry] = useState<string>(
    isEdit ? initialInvoice?.senderAddress.country : ""
  );
  const [billToClientName, setBillToClientName] = useState<string>(
    isEdit ? initialInvoice?.clientName : ""
  );
  const [billToClientEmail, setBillToClientEmail] = useState<string>(
    isEdit ? initialInvoice?.clientEmail : ""
  );
  const [billToStreet, setBillToStreet] = useState<string>(
    isEdit ? initialInvoice?.clientAddress.street : ""
  );
  const [billToCity, setBillToCity] = useState<string>(
    isEdit ? initialInvoice?.clientAddress.city : ""
  );
  const [billToPostcode, setBillToPostcode] = useState<string>(
    isEdit ? initialInvoice?.clientAddress.postCode : ""
  );
  const [billToCountry, setBillToCountry] = useState<string>(
    isEdit ? initialInvoice?.clientAddress.country : ""
  );
  const [projectDescription, setProjectDescription] = useState<string>(
    isEdit ? initialInvoice?.description : ""
  );
  const [total, setTotal] = useState<number>(
    isEdit ? initialInvoice?.total : 0
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const paymentTermOptions = [
    { label: "Net 1 Day", value: 1 },
    { label: "Net 7 Days", value: 7 },
    { label: "Net 15 Days", value: 15 },
    { label: "Net 30 Days", value: 30 },
  ];

  useEffect(() => {
    calculateTotal();
  }, [lineItems]);

  useEffect(() => {
    calculatePaymentDue();
  }, [createdAt, paymentTerm]);

  const onChangeInvoiceDate = (
    _event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    const currentDate = selectedDate || invoiceDate;
    setShowDatePicker(Platform.OS === "ios");
    setInvoiceDate(currentDate);
  };

  const handlePaymentTermSelect = (term: number) => {
    setPaymentTerm(term);
  };

  const calculatePaymentDue = () => {
    if (createdAt && paymentTerm) {
      const dueDate = new Date(createdAt);
      dueDate.setDate(dueDate.getDate() + paymentTerm);
      setPaymentDue(dueDate);
    } else {
      setPaymentDue(undefined);
    }
  };

  const onPressAddLineItem = () => {
    const newLineItems = [...lineItems];
    newLineItems.push({ ...initialItem });
    setLineItems(newLineItems);
  };

  const onPressDeleteLineItem = (index: number) => {
    const newLineItems = [...lineItems];
    newLineItems.splice(index, 1);
    setLineItems(newLineItems);
  };

  const handleLineItemChange = (
    index: number,
    name: keyof Item,
    value: string
  ) => {
    const newLineItems = lineItems.map((item, i) =>
      i === index
        ? {
            ...item,
            [name]:
              name === "quantity" || name === "price"
                ? parseFloat(value)
                : value,
          }
        : item
    );
    setLineItems(newLineItems);
  };

  const calculateTotal = () => {
    const newTotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    setTotal(newTotal);
  };

  const validateFields = (): boolean => {
    if (
      !billFromStreet ||
      !billFromCity ||
      !billFromPostcode ||
      !billFromCountry ||
      !billToClientName ||
      !billToClientEmail ||
      !billToStreet ||
      !billToCity ||
      !billToPostcode ||
      !billToCountry ||
      paymentTerm === null ||
      !projectDescription ||
      lineItems.some(
        (item) => !item.name || isNaN(item.quantity) || isNaN(item.price)
      )
    ) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return false;
    }
    return true;
  };

  const handleSave = (status: "draft" | "pending") => {
    const invoiceData: Omit<
      Invoice,
      "id" | "createdAt" | "paymentDue" | "status"
    > = {
      description: projectDescription,
      paymentTerms: paymentTerm!,
      clientName: billToClientName,
      clientEmail: billToClientEmail,
      senderAddress: {
        street: billFromStreet,
        city: billFromCity,
        postCode: billFromPostcode,
        country: billFromCountry,
      },
      clientAddress: {
        street: billToStreet,
        city: billToCity,
        postCode: billToPostcode,
        country: billToCountry,
      },
      items: lineItems.map((item) => ({
        ...item,
        total: item.quantity * item.price,
      })),
      total,
    };

    if (status === "pending" && !validateFields()) {
      return;
    }

    onSave(invoiceData, status);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ padding: 24 }}>
        <TypoGraphy variant="h1">
          {type === "new" ? "New Invoice" : "Edit Invoice"}
        </TypoGraphy>
        <TypoGraphy
          variant="h3"
          style={{ color: colors.purple[100], marginBottom: 8 }}
        >
          Bill From
        </TypoGraphy>
        <Input
          label="Street Address"
          value={billFromStreet}
          onChangeText={setBillFromStreet}
        />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <Input
            label="City"
            value={billFromCity}
            onChangeText={setBillFromCity}
          />
          <Input
            label="Postcode"
            value={billFromPostcode}
            onChangeText={setBillFromPostcode}
          />
        </View>
        <Input
          label="Country"
          value={billFromCountry}
          onChangeText={setBillFromCountry}
        />

        <TypoGraphy
          variant="h3"
          style={{ color: colors.purple[100], marginBottom: 8 }}
        >
          Bill To
        </TypoGraphy>
        <Input
          label="Client's Name"
          value={billToClientName}
          onChangeText={setBillToClientName}
        />
        <Input
          label="Client's Email"
          value={billToClientEmail}
          onChangeText={setBillToClientEmail}
        />
        <Input
          label="Street Address"
          value={billToStreet}
          onChangeText={setBillToStreet}
        />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <Input label="City" value={billToCity} onChangeText={setBillToCity} />
          <Input
            label="Postcode"
            value={billToPostcode}
            onChangeText={setBillToPostcode}
          />
        </View>
        <Input
          label="Country"
          value={billToCountry}
          onChangeText={setBillToCountry}
        />

        <InputDatePicker
          label="Invoice Date"
          value={invoiceDate}
          onPress={() => setShowDatePicker(!showDatePicker)}
        />

        {showDatePicker ? (
          <DateTimePicker
            testID="invoiceDatePicker"
            value={invoiceDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChangeInvoiceDate}
          />
        ) : null}

        <Selector
          label="Payment Terms"
          options={paymentTermOptions}
          onSelect={handlePaymentTermSelect}
          selectedValue={paymentTerm}
          renderItem={(item) => <TypoGraphy>{item.label}</TypoGraphy>}
          extractValue={(item) => item.value}
        />

        <Input
          label="Project Description"
          value={projectDescription}
          onChangeText={setProjectDescription}
        />

        <TypoGraphy variant="h1">Item List</TypoGraphy>
        {lineItems.map((item, index) => (
          <View key={`${item.name}-${index}`}>
            <Input
              label="Item Name"
              value={item.name}
              onChangeText={(text) => handleLineItemChange(index, "name", text)}
            />
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Input
                label="Qty"
                value={item.quantity.toString()}
                onChangeText={(text) =>
                  handleLineItemChange(index, "quantity", text)
                }
                keyboardType="numeric"
              />
              <Input
                label="Price"
                value={item.price.toString()}
                onChangeText={(text) =>
                  handleLineItemChange(index, "price", text)
                }
                keyboardType="numeric"
              />
              <Input
                label="Total"
                value={(item.quantity * item.price).toFixed(2)}
                editable={false}
              />
              <Pressable onPress={() => onPressDeleteLineItem(index)}>
                <IconDelete />
              </Pressable>
            </View>
          </View>
        ))}

        <Button
          variant="secondary"
          onPress={onPressAddLineItem}
          fullWidth
          containerStyle={{ backgroundColor: colors.black[200] }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconPlus />
            <TypoGraphy style={{ marginLeft: 8 }} variant="h2">
              Add New Item
            </TypoGraphy>
          </View>
        </Button>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingVertical: 12,
          paddingHorizontal: 24,
          justifyContent: "center",
          flex: 1,
          backgroundColor: colors.black[200],
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="secondary"
          onPress={() => handleSave("draft")}
          containerStyle={{ backgroundColor: colors.grey[300], minWidth: 70 }}
        >
          <TypoGraphy variant="h2">Discard</TypoGraphy>
        </Button>
        <Button
          variant="secondary"
          onPress={() => handleSave("draft")}
          containerStyle={{ backgroundColor: colors.grey[200], width: 120 }}
        >
          <TypoGraphy variant="h2">Save as Draft</TypoGraphy>
        </Button>
        <Button
          variant="primary"
          onPress={() => handleSave("pending")}
          containerStyle={{ width: 120 }}
        >
          <TypoGraphy variant="h2">Save & Send</TypoGraphy>
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black[100],
  },
  // ... other styles
});
