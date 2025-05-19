import invoiceService, { Invoice } from "@/service/invoice.service";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export const InvoiceDetails = () => {
  const { id } = useLocalSearchParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, [id]);

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invoice Details</Text>
      <Text>Invoice ID: {invoice.id}</Text>
      <Text>Invoice Number: {invoice.clientName}</Text>
      <Text>Total Amount: {invoice.total}</Text>
      <Text>Description: {invoice.description}</Text>
      <Text>Payment Due: {invoice.paymentDue}</Text>
      <Text>Client Email: {invoice.clientEmail}</Text>
      <Text>Status: {invoice.status}</Text>
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
