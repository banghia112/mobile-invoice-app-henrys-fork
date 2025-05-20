import { IconDelete, IconPlus } from "@/assets/svg";
import { colors } from "@/constants/Colors";
import invoiceService, { Invoice, Item } from "@/service/invoice.service"; // Import types
import { formatDateForSave } from "@/utils/formatter.utils";
import { router } from "expo-router";
import { FieldArray, Formik, FormikProps } from "formik";
import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import * as Yup from "yup";
import { Button } from "../Button";
import { Input } from "../Input";
import { InputDatePicker } from "../Input/InputDatePicker";
import { Selector } from "../Selector";
import { TypoGraphy } from "../TypoGraphy";

interface InvoiceFormProps {
  type: "new" | "edit";
  initialInvoice?: Invoice;
}

interface FormValues {
  billFromStreet: string;
  billFromCity: string;
  billFromPostcode: string;
  billFromCountry: string;
  billToClientName: string;
  billToClientEmail: string;
  billToStreet: string;
  billToCity: string;
  billToPostcode: string;
  billToCountry: string;
  invoiceDate: Date;
  paymentTerm: number | null;
  projectDescription: string;
  items: Item[];
}

const initialItem: Item = {
  name: "",
  quantity: 1,
  price: 0,
  total: 0,
};

const paymentTermOptions = [
  { label: "Net 1 Day", value: 1 },
  { label: "Net 7 Days", value: 7 },
  { label: "Net 15 Days", value: 15 },
  { label: "Net 30 Days", value: 30 },
];

const validationSchema = Yup.object().shape({
  billFromStreet: Yup.string().required("Street Address is required"),
  billFromCity: Yup.string().required("City is required"),
  billFromPostcode: Yup.string().required("Postcode is required"),
  billFromCountry: Yup.string().required("Country is required"),
  billToClientName: Yup.string().required("Client's Name is required"),
  billToClientEmail: Yup.string()
    .email("Invalid email")
    .required("Client's Email is required"),
  billToStreet: Yup.string().required("Street Address is required"),
  billToCity: Yup.string().required("City is required"),
  billToPostcode: Yup.string().required("Postcode is required"),
  billToCountry: Yup.string().required("Country is required"),
  invoiceDate: Yup.date().required("Invoice Date is required"),
  paymentTerm: Yup.number().nullable().required("Payment Terms is required"),
  projectDescription: Yup.string().required("Project Description is required"),
  items: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required("Item Name is required"),
        quantity: Yup.number()
          .min(1, "Quantity must be at least 1")
          .required("Quantity is required"),
        price: Yup.number()
          .min(0, "Price cannot be negative")
          .required("Price is required"),
        total: Yup.number(),
      })
    )
    .min(1, "At least one item is required"),
});

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  type,
  initialInvoice,
}) => {
  const isEdit = type === "edit" && initialInvoice;
  const initialValues: FormValues = {
    billFromStreet: isEdit ? initialInvoice?.senderAddress.street : "",
    billFromCity: isEdit ? initialInvoice?.senderAddress.city : "",
    billFromPostcode: isEdit ? initialInvoice?.senderAddress.postCode : "",
    billFromCountry: isEdit ? initialInvoice?.senderAddress.country : "",
    billToClientName: isEdit ? initialInvoice?.clientName : "",
    billToClientEmail: isEdit ? initialInvoice?.clientEmail : "",
    billToStreet: isEdit ? initialInvoice?.clientAddress.street : "",
    billToCity: isEdit ? initialInvoice?.clientAddress.city : "",
    billToPostcode: isEdit ? initialInvoice?.clientAddress.postCode : "",
    billToCountry: isEdit ? initialInvoice?.clientAddress.country : "",
    invoiceDate:
      isEdit && initialInvoice?.createdAt
        ? new Date(initialInvoice.createdAt)
        : new Date(),
    paymentTerm: isEdit ? initialInvoice?.paymentTerms : null,
    projectDescription: isEdit ? initialInvoice?.description : "",
    items: isEdit ? initialInvoice?.items || [initialItem] : [initialItem],
  };

  const handleDiscard = async () => {
    if (isEdit && initialInvoice.id) {
      await invoiceService.deleteInvoice(initialInvoice.id);
    }
    router.back();
  };

  const handleSave = async (invoiceData: Omit<Invoice, "status" | "id">) => {
    const invoice: Omit<Invoice, "id"> = { ...invoiceData, status: "pending" };

    if (isEdit) {
      const updatedInvoice = { ...invoice, id: initialInvoice.id };
      await invoiceService.updateInvoice(initialInvoice.id, updatedInvoice);
    } else {
      await invoiceService.addInvoice(invoice);
    }
    router.back();
  };

  const handleSaveDraft = async (values: FormValues) => {
    const paymentDueDate = new Date(values.invoiceDate);
    if (paymentDueDate && values.paymentTerm !== null) {
      paymentDueDate.setDate(paymentDueDate.getDate() + values.paymentTerm);
    }
    const invoiceData: Partial<Omit<Invoice, "id">> = {
      description: values.projectDescription ?? "",
      paymentTerms: values.paymentTerm! ?? "",
      clientName: values.billToClientName ?? "",
      clientEmail: values.billToClientEmail ?? "",
      senderAddress: {
        street: values.billFromStreet ?? "",
        city: values.billFromCity ?? "",
        postCode: values.billFromPostcode ?? "",
        country: values.billFromCountry ?? "",
      },
      clientAddress: {
        street: values.billToStreet ?? "",
        city: values.billToCity ?? "",
        postCode: values.billToPostcode ?? "",
        country: values.billToCountry ?? "",
      },
      paymentDue: values.invoiceDate ? formatDateForSave(paymentDueDate) : "",
      createdAt: values.invoiceDate
        ? formatDateForSave(values.invoiceDate)
        : "",
      status: "draft",
    };

    if (values.items.length) {
      invoiceData.items = values.items.map((item) => ({
        ...item,
        total: item.quantity * item.price,
      }));

      invoiceData.total = values.items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );
    }

    await invoiceService.addDraftInvoice(invoiceData);

    router.back();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        const paymentDueDate = new Date(values.invoiceDate);
        if (values.paymentTerm !== null) {
          paymentDueDate.setDate(paymentDueDate.getDate() + values.paymentTerm);
        }
        const invoiceData: Omit<Invoice, "status" | "id"> = {
          description: values.projectDescription,
          paymentTerms: values.paymentTerm!,
          clientName: values.billToClientName,
          clientEmail: values.billToClientEmail,
          senderAddress: {
            street: values.billFromStreet,
            city: values.billFromCity,
            postCode: values.billFromPostcode,
            country: values.billFromCountry,
          },
          clientAddress: {
            street: values.billToStreet,
            city: values.billToCity,
            postCode: values.billToPostcode,
            country: values.billToCountry,
          },
          items: values.items.map((item) => ({
            ...item,
            total: item.quantity * item.price,
          })),
          total: values.items.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0
          ),
          paymentDue: formatDateForSave(paymentDueDate),
          createdAt: formatDateForSave(values.invoiceDate),
        };
        handleSave(invoiceData);
        actions.setSubmitting(false);
      }}
    >
      {(formikProps: FormikProps<FormValues>) => (
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
              value={formikProps.values.billFromStreet}
              onChangeText={formikProps.handleChange("billFromStreet")}
              onBlur={formikProps.handleBlur("billFromStreet")}
              error={
                formikProps.touched.billFromStreet
                  ? formikProps.errors.billFromStreet
                  : ""
              }
            />
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 16 }}
            >
              <Input
                label="City"
                value={formikProps.values.billFromCity}
                onChangeText={formikProps.handleChange("billFromCity")}
                onBlur={formikProps.handleBlur("billFromCity")}
                error={
                  formikProps.touched.billFromCity
                    ? formikProps.errors.billFromCity
                    : ""
                }
              />
              <Input
                label="Postcode"
                value={formikProps.values.billFromPostcode}
                onChangeText={formikProps.handleChange("billFromPostcode")}
                onBlur={formikProps.handleBlur("billFromPostcode")}
                error={
                  formikProps.touched.billFromPostcode
                    ? formikProps.errors.billFromPostcode
                    : ""
                }
              />
            </View>
            <Input
              label="Country"
              value={formikProps.values.billFromCountry}
              onChangeText={formikProps.handleChange("billFromCountry")}
              onBlur={formikProps.handleBlur("billFromCountry")}
              error={
                formikProps.touched.billFromCountry
                  ? formikProps.errors.billFromCountry
                  : ""
              }
            />

            <TypoGraphy
              variant="h3"
              style={{ color: colors.purple[100], marginBottom: 8 }}
            >
              Bill To
            </TypoGraphy>
            <Input
              label="Client's Name"
              value={formikProps.values.billToClientName}
              onChangeText={formikProps.handleChange("billToClientName")}
              onBlur={formikProps.handleBlur("billToClientName")}
              error={
                formikProps.touched.billToClientName
                  ? formikProps.errors.billToClientName
                  : ""
              }
            />
            <Input
              label="Client's Email"
              value={formikProps.values.billToClientEmail}
              onChangeText={formikProps.handleChange("billToClientEmail")}
              onBlur={formikProps.handleBlur("billToClientEmail")}
              error={
                formikProps.touched.billToClientEmail
                  ? formikProps.errors.billToClientEmail
                  : ""
              }
            />
            <Input
              label="Street Address"
              value={formikProps.values.billToStreet}
              onChangeText={formikProps.handleChange("billToStreet")}
              onBlur={formikProps.handleBlur("billToStreet")}
              error={
                formikProps.touched.billToStreet
                  ? formikProps.errors.billToStreet
                  : ""
              }
            />
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 16 }}
            >
              <Input
                label="City"
                value={formikProps.values.billToCity}
                onChangeText={formikProps.handleChange("billToCity")}
                onBlur={formikProps.handleBlur("billToCity")}
                error={
                  formikProps.touched.billToCity
                    ? formikProps.errors.billToCity
                    : ""
                }
              />
              <Input
                label="Postcode"
                value={formikProps.values.billToPostcode}
                onChangeText={formikProps.handleChange("billToPostcode")}
                onBlur={formikProps.handleBlur("billToPostcode")}
                error={
                  formikProps.touched.billToPostcode
                    ? formikProps.errors.billToPostcode
                    : ""
                }
              />
            </View>
            <Input
              label="Country"
              value={formikProps.values.billToCountry}
              onChangeText={formikProps.handleChange("billToCountry")}
              onBlur={formikProps.handleBlur("billToCountry")}
              error={
                formikProps.touched.billToCountry
                  ? formikProps.errors.billToCountry
                  : ""
              }
            />

            <InputDatePicker
              label="Invoice Date"
              value={formikProps.values.invoiceDate}
              onChange={(_event, date) => {
                formikProps.setFieldValue("invoiceDate", date);
              }}
            />

            <Selector
              label="Payment Terms"
              options={paymentTermOptions}
              onSelect={(value) =>
                formikProps.setFieldValue("paymentTerm", value)
              }
              selectedValue={formikProps.values.paymentTerm}
            />

            <Input
              label="Project Description"
              value={formikProps.values.projectDescription}
              onChangeText={formikProps.handleChange("projectDescription")}
              onBlur={formikProps.handleBlur("projectDescription")}
              error={
                formikProps.touched.projectDescription
                  ? formikProps.errors.projectDescription
                  : ""
              }
            />

            <TypoGraphy variant="h1">Item List</TypoGraphy>
            <FieldArray name="items">
              {(arrayHelpers) => (
                <View>
                  {formikProps.values.items.map((item, index) => (
                    <View key={index}>
                      <Input
                        label="Item Name"
                        value={formikProps.values.items[index].name}
                        onChangeText={formikProps.handleChange(
                          `items.${index}.name`
                        )}
                        onBlur={formikProps.handleBlur(`items.${index}.name`)}
                        error={
                          formikProps.touched.items?.[index]?.name &&
                          typeof formikProps.errors.items?.[index] !== "string"
                            ? formikProps.errors.items?.[index]?.name
                            : ""
                        }
                      />
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Input
                          label="Qty"
                          value={formikProps.values.items[
                            index
                          ].quantity.toString()}
                          onChangeText={formikProps.handleChange(
                            `items.${index}.quantity`
                          )}
                          onBlur={formikProps.handleBlur(
                            `items.${index}.quantity`
                          )}
                          keyboardType="numeric"
                          error={
                            formikProps.touched.items?.[index]?.quantity &&
                            typeof formikProps.errors.items?.[index] !==
                              "string"
                              ? formikProps.errors.items?.[index]?.quantity
                              : ""
                          }
                        />
                        <Input
                          label="Price"
                          value={formikProps.values.items[
                            index
                          ].price.toString()}
                          onChangeText={formikProps.handleChange(
                            `items.${index}.price`
                          )}
                          onBlur={formikProps.handleBlur(
                            `items.${index}.price`
                          )}
                          keyboardType="numeric"
                          error={
                            formikProps.touched.items?.[index]?.price &&
                            typeof formikProps.errors.items?.[index] !==
                              "string"
                              ? formikProps.errors.items?.[index]?.price
                              : ""
                          }
                        />
                        <Input
                          label="Total"
                          value={(
                            formikProps.values.items[index].quantity *
                            formikProps.values.items[index].price
                          ).toFixed(2)}
                          editable={false}
                        />
                        <Pressable onPress={() => arrayHelpers.remove(index)}>
                          <IconDelete />
                        </Pressable>
                      </View>
                    </View>
                  ))}

                  <Button
                    variant="secondary"
                    onPress={() => arrayHelpers.push(initialItem)}
                    fullWidth
                    containerStyle={{ backgroundColor: colors.black[200] }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <IconPlus />
                      <TypoGraphy style={{ marginLeft: 8 }} variant="h2">
                        Add New Item
                      </TypoGraphy>
                    </View>
                  </Button>
                </View>
              )}
            </FieldArray>
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
            {isEdit ? (
              <>
                <Button
                  variant="secondary"
                  onPress={handleDiscard}
                  containerStyle={{
                    backgroundColor: colors.grey[300],
                    minWidth: 70,
                  }}
                >
                  <TypoGraphy variant="h2">Cancel</TypoGraphy>
                </Button>

                <Button
                  variant="primary"
                  onPress={formikProps.handleSubmit}
                  disabled={formikProps.isSubmitting}
                  containerStyle={{ width: 120 }}
                >
                  <TypoGraphy variant="h2">Save changes</TypoGraphy>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="secondary"
                  onPress={handleDiscard}
                  containerStyle={{
                    backgroundColor: colors.grey[300],
                    minWidth: 70,
                  }}
                >
                  <TypoGraphy variant="h2">Discard</TypoGraphy>
                </Button>
                <Button
                  variant="secondary"
                  onPress={() => {
                    handleSaveDraft(formikProps.values);
                  }}
                  containerStyle={{
                    backgroundColor: colors.grey[200],
                    width: 120,
                  }}
                >
                  <TypoGraphy variant="h2">Save as Draft</TypoGraphy>
                </Button>
                <Button
                  variant="primary"
                  onPress={formikProps.handleSubmit}
                  disabled={formikProps.isSubmitting}
                  containerStyle={{ width: 120 }}
                >
                  <TypoGraphy variant="h2">Save & Send</TypoGraphy>
                </Button>
              </>
            )}
          </View>
        </ScrollView>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black[100],
  },
  // ... other styles
});
