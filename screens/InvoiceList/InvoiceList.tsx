import { Link } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const invoicesData = [
  { id: '1', number: 'INV-001', amount: '$100' },
  { id: '2', number: 'INV-002', amount: '$250' },
  { id: '3', number: 'INV-003', amount: '$75' },
];

export const InvoiceList = () => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.listItem} onPress={() => console.log(`Viewing invoice ${item.id}`)}>
      <Link href={`/invoices/${item.id}`}>
        <Text>{item.number} - {item.amount}</Text>
      </Link>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invoices</Text>
      <FlatList
        data={invoicesData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
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
  listItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});