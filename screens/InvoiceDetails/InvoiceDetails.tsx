import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const InvoiceDetails = () => {
  const { id } = useLocalSearchParams();

  const invoice = { id: id, number: `INV-${id}-DETAIL`, total: '$XXX.XX' };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invoice Details</Text>
      <Text>Invoice ID: {invoice.id}</Text>
      <Text>Invoice Number: {invoice.number}</Text>
      <Text>Total Amount: {invoice.total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});