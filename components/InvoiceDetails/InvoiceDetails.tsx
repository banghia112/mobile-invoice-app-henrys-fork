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

  const loadInvoiceDetails = async () => {
    try {
      const fetchedInvoice = await invoiceService.getInvoiceById(id as string);
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

  useLayoutEffect(
    useCallback(() => {
      loadInvoiceDetails();
    }, [id]),
    [loadInvoiceDetails]
  );

  const onDelete = useCallback(async () => {
    await invoiceService.deleteInvoice(invoice!.id);
    setShowDeleteModal(false);
    router.back();
  }, [invoice?.id]);

  const onPressEdit = useCallback(() => {
    router.push(`/invoices/${invoice!.id}/edit`);
  }, [invoice?.id]);

  const handleMarkPaid = useCallback(async () => {
    if (invoice!.status !== "pending") {
      Alert.alert("Error", "Status have to be pending");
      return;
    }

    const updatedInvoice = { ...invoice! };
    updatedInvoice.status = "paid";

    await invoiceService.updateInvoice(invoice!.id, updatedInvoice);
    router.back();
  }, [invoice]);

  const getStatusColor = useCallback((status: string) => {
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
  }, []);

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

  const statusColor = getStatusColor(invoice.status || "draft");

  return (
    <View style={styles.root}>
      <View style={styles.statusContainer}>
        <TypoGraphy variant="h3">Status</TypoGraphy>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColor.background },
          ]}
        >
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: statusColor.indicator },
            ]}
          />
          <TypoGraphy variant="h3" style={{ color: statusColor.text }}>
            {capitalizeString(invoice.status)}
          </TypoGraphy>
        </View>
      </View>
      <View style={styles.invoiceInfoContainer}>
        <TypoGraphy style={styles.invoiceId}>#{invoice.id}</TypoGraphy>
        <TypoGraphy style={styles.invoiceDescription}>
          {invoice.description}
        </TypoGraphy>
        <View style={styles.addressContainer}>
          <TypoGraphy style={styles.addressText}>
            {invoice.senderAddress.street}
          </TypoGraphy>
          <TypoGraphy style={styles.addressText}>
            {invoice.senderAddress.city}
          </TypoGraphy>
          <TypoGraphy style={styles.addressText}>
            {invoice.senderAddress.postCode}
          </TypoGraphy>
          <TypoGraphy style={styles.addressText}>
            {invoice.senderAddress.country}
          </TypoGraphy>
        </View>
      </View>
      <View style={styles.itemsContainer}>
        {invoice.items.map((item: any, idx: number) => (
          <View key={idx} style={styles.itemRow}>
            <View>
              <TypoGraphy style={styles.itemName}>{item.name}</TypoGraphy>
              <TypoGraphy style={styles.itemQuantity}>
                {item.quantity} x {formatPayment(item.price)}
              </TypoGraphy>
            </View>
            <View>
              <TypoGraphy style={styles.itemTotal}>
                {formatPayment(item.total)}
              </TypoGraphy>
            </View>
          </View>
        ))}
        <View style={styles.amountDueContainer}>
          <TypoGraphy style={styles.amountDueText}>Amount Due</TypoGraphy>
          <TypoGraphy style={styles.amountDueValue}>
            {formatPayment(invoice.total)}
          </TypoGraphy>
        </View>
      </View>
      <View style={styles.actionButtonsContainer}>
        <Pressable style={styles.editButton} onPress={onPressEdit}>
          <TypoGraphy style={styles.buttonText}>Edit</TypoGraphy>
        </Pressable>
        <Pressable
          style={styles.deleteButton}
          onPress={() => setShowDeleteModal(true)}
        >
          <TypoGraphy style={styles.buttonText}>Delete</TypoGraphy>
        </Pressable>
        <Pressable style={styles.markAsPaidButton} onPress={handleMarkPaid}>
          <TypoGraphy style={styles.buttonText}>Mark as Paid</TypoGraphy>
        </Pressable>
      </View>
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TypoGraphy style={styles.modalTitle}>Confirm Deletion</TypoGraphy>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete invoice #{invoice.id} ? This
              action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => setShowDeleteModal(false)}
                style={styles.cancelButton}
              >
                <TypoGraphy style={styles.buttonText}>Cancel</TypoGraphy>
              </Pressable>
              <Pressable onPress={onDelete} style={styles.confirmDeleteButton}>
                <TypoGraphy style={styles.buttonText}>Delete</TypoGraphy>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.black[100],
  },
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
  statusContainer: {
    backgroundColor: colors.black[200],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 24,
    marginHorizontal: 16,
    borderRadius: 16,
  },
  statusBadge: {
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    width: 100,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  invoiceInfoContainer: {
    padding: 24,
    backgroundColor: colors.black[200],
    margin: 16,
    borderRadius: 16,
  },
  invoiceId: {
    color: colors.white[100],
    fontWeight: "bold",
  },
  invoiceDescription: {
    color: colors.white[100],
  },
  addressContainer: {
    marginTop: 24,
  },
  addressText: {
    color: colors.white[100],
  },
  itemsContainer: {
    padding: 24,
    backgroundColor: colors.black[200],
    marginHorizontal: 16,
    borderRadius: 16,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  itemName: {
    color: colors.white[100],
    fontWeight: "bold",
  },
  itemQuantity: {
    color: colors.white[100],
    marginTop: 4,
  },
  itemTotal: {
    color: colors.white[100],
    fontWeight: "bold",
  },
  amountDueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.black[300],
    padding: 24,
    marginTop: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  amountDueText: {
    color: colors.white[100],
  },
  amountDueValue: {
    color: colors.white[100],
    fontWeight: "bold",
    fontSize: 24,
  },
  actionButtonsContainer: {
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
  },
  editButton: {
    flex: 2,
    backgroundColor: colors.black[100],
    marginRight: 8,
    padding: 12,
    borderRadius: 24,
  },
  deleteButton: {
    flex: 3,
    backgroundColor: colors.red[100],
    marginRight: 8,
    padding: 12,
    borderRadius: 24,
  },
  markAsPaidButton: {
    flex: 5,
    backgroundColor: colors.purple[200],
    padding: 12,
    borderRadius: 24,
  },
  buttonText: {
    color: colors.white[100],
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.black[100],
    borderRadius: 16,
    padding: 32,
    width: "90%",
    alignItems: "flex-start",
  },
  modalTitle: {
    color: colors.white[100],
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalMessage: {
    color: colors.grey[200],
    marginBottom: 32,
    fontSize: 12,
    fontWeight: "600",
  },
  modalButtons: {
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  cancelButton: {
    backgroundColor: colors.black[200],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginRight: 12,
  },
  confirmDeleteButton: {
    backgroundColor: colors.red[100],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
});
