import { colors } from "@/constants/Colors";
import invoiceService, { Invoice } from "@/service/invoice.service";
import { capitalizeString, formatPayment } from "@/utils/formatter.utils";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { TypoGraphy } from "../TypoGraphy";

export const InvoiceDetails = () => {
  const { id } = useLocalSearchParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(
    useCallback(() => {
      const loadInvoiceDetails = async () => {
        try {
          const fetchedInvoice = await invoiceService.getInvoiceById(
            id as string
          );
          if (fetchedInvoice) {
            setInvoice(fetchedInvoice);
          } else {
            setError(`Invoice with ID ${id} not found.`);
          }
        } catch (err: any) {
          setError(err.message || "Failed to load invoice details.");
        } finally {
          setLoading(false);
        }
      };

      loadInvoiceDetails();
    }, [id])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading invoice details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  if (!invoice) {
    return (
      <View style={styles.container}>
        <Text>Invoice not found.</Text>
      </View>
    );
  }

  const onDelete = async () => {
    await invoiceService.deleteInvoice(invoice.id);
    setShowDeleteModal(false);
    router.back();
  };

  const onPressEdit = () => {
    router.push(`/invoices/${invoice.id}/edit`);
  };

  const handleMarkPaid = async () => {
    if (invoice.status !== "pending") {
      Alert.alert("Error", "Status have to be pending");
      return;
    }

    const updatedInvoice = { ...invoice };
    updatedInvoice.status === "paid";

    await invoiceService.updateInvoice(invoice.id, updatedInvoice);

    router.back();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return {
          background: "rgba(230, 159, 56, 0.5)",
          text: "#F2B857",
          indicator: "#F2B857",
        };
      case "paid":
        return {
          background: "rgba(128, 224, 177, 0.5)",
          text: "#80E0B1",
          indicator: "#80E0B1",
        };
      case "draft":
        return {
          background: "rgba(136, 142, 176, 0.5)",
          text: colors.white[100],
          indicator: colors.white[100],
        };
      default:
        return {
          background: "rgba(136, 142, 176, 0.5)",
          text: colors.white[100],
          indicator: colors.white[100],
        };
    }
  };
  const statusColor = getStatusColor(invoice.status || "draft");

  return (
    <View style={{ flex: 1, backgroundColor: colors.black[100] }}>
      <View
        style={{
          backgroundColor: colors.black[200],
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 24,
          marginHorizontal: 16,
          borderRadius: 16,
        }}
      >
        <TypoGraphy variant="h3">Status</TypoGraphy>
        <View
          style={{
            backgroundColor: statusColor.background,
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            padding: 12,
            width: 100,
          }}
        >
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 12,
              backgroundColor: statusColor.indicator,
              marginRight: 12,
            }}
          />
          <TypoGraphy variant="h3" style={{ color: statusColor.text }}>
            {capitalizeString(invoice.status)}
          </TypoGraphy>
        </View>
      </View>
      <View
        style={{
          padding: 24,
          backgroundColor: colors.black[200],
          margin: 16,
          borderRadius: 16,
        }}
      >
        <TypoGraphy style={{ color: colors.white[100], fontWeight: "bold" }}>
          #{invoice.id}
        </TypoGraphy>
        <TypoGraphy style={{ color: colors.white[100] }}>
          {invoice.description}
        </TypoGraphy>
        <View style={{ marginTop: 24 }}>
          <TypoGraphy style={{ color: colors.white[100] }}>
            {invoice.senderAddress.street}
          </TypoGraphy>
          <TypoGraphy style={{ color: colors.white[100] }}>
            {invoice.senderAddress.city}
          </TypoGraphy>
          <TypoGraphy style={{ color: colors.white[100] }}>
            {invoice.senderAddress.postCode}
          </TypoGraphy>
          <TypoGraphy style={{ color: colors.white[100] }}>
            {invoice.senderAddress.country}
          </TypoGraphy>
        </View>
      </View>
      <View
        style={{
          padding: 24,
          backgroundColor: colors.black[200],
          marginHorizontal: 16,
          borderRadius: 16,
        }}
      >
        {invoice.items.map((item: any, idx: number) => (
          <View
            key={idx}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 12,
            }}
          >
            <View>
              <TypoGraphy
                style={{ color: colors.white[100], fontWeight: "bold" }}
              >
                {item.name}
              </TypoGraphy>
              <TypoGraphy style={{ color: colors.white[100], marginTop: 4 }}>
                {item.quantity} x {formatPayment(item.price)}
              </TypoGraphy>
            </View>
            <View>
              <TypoGraphy
                style={{ color: colors.white[100], fontWeight: "bold" }}
              >
                {formatPayment(item.total)}
              </TypoGraphy>
            </View>
          </View>
        ))}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: colors.black[300],
            padding: 24,
            marginTop: 16,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}
        >
          <TypoGraphy style={{ color: colors.white[100] }}>
            Amount Due
          </TypoGraphy>
          <TypoGraphy
            style={{
              color: colors.white[100],
              fontWeight: "bold",
              fontSize: 24,
            }}
          >
            {formatPayment(invoice.total)}
          </TypoGraphy>
        </View>
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 24,
          paddingVertical: 16,
          backgroundColor: colors.black[200],
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Pressable
          style={{
            flex: 2,
            backgroundColor: colors.black[100],
            marginRight: 8,
            padding: 12,
            borderRadius: 24,
          }}
          onPress={onPressEdit}
        >
          <TypoGraphy
            variant="h3"
            style={{ color: colors.white[100], textAlign: "center" }}
          >
            Edit
          </TypoGraphy>
        </Pressable>
        <Pressable
          onPress={() => setShowDeleteModal(true)}
          style={{
            flex: 3,
            backgroundColor: colors.red[100],
            marginRight: 8,
            padding: 12,
            borderRadius: 24,
          }}
        >
          <TypoGraphy
            variant="h3"
            style={{ color: colors.white[100], textAlign: "center" }}
          >
            Delete
          </TypoGraphy>
        </Pressable>
        <Pressable
          style={{
            flex: 5,
            backgroundColor: colors.purple[200],
            padding: 12,
            borderRadius: 24,
          }}
          onPress={handleMarkPaid}
        >
          <TypoGraphy
            variant="h3"
            style={{ color: colors.white[100], textAlign: "center" }}
          >
            Mark as Paid
          </TypoGraphy>
        </Pressable>
      </View>
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: colors.black[100],
              borderRadius: 16,
              padding: 32,
              width: "90%",
              alignItems: "flex-start",
            }}
          >
            <TypoGraphy
              variant="h2"
              style={{
                color: colors.white[100],
                fontWeight: "bold",
                marginBottom: 16,
              }}
            >
              Confirm Deletion
            </TypoGraphy>
            <Text
              style={{
                color: colors.grey[200],
                marginBottom: 32,
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              Are you sure you want to delete invoice #{invoice.id} ? This
              action cannot be undone.
            </Text>
            <View style={{ flexDirection: "row", alignSelf: "flex-end" }}>
              <Pressable
                onPress={() => setShowDeleteModal(false)}
                style={{
                  backgroundColor: colors.black[200],
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  borderRadius: 24,
                  marginRight: 12,
                }}
              >
                <TypoGraphy variant="h3" style={{ color: colors.white[100] }}>
                  Cancel
                </TypoGraphy>
              </Pressable>
              <Pressable
                onPress={onDelete}
                style={{
                  backgroundColor: colors.red[100],
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  borderRadius: 24,
                }}
              >
                <TypoGraphy variant="h3" style={{ color: colors.white[100] }}>
                  Delete
                </TypoGraphy>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  error: {
    color: "red",
  },
});
