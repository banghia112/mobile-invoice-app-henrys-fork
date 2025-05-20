import { IconArrowDown, IconListEmpty, IconPlus } from "@/assets/svg";
import { colors } from "@/constants/Colors";
import invoiceService, { Invoice } from "@/service/invoice.service";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button } from "../Button";
import { TypoGraphy } from "../TypoGraphy";
import { InvoiceItem } from "./InvoiceItem";

interface InvoiceListProps {}

export const InvoiceList = ({}: InvoiceListProps) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const fetchedInvoices = await invoiceService.getInvoices();
      setInvoices(fetchedInvoices);
    } catch (err: any) {
      setError(err.message || "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadInvoices();
    }, [])
  );

  const renderItem = useCallback(
    ({ item }: { item: Invoice }) => <InvoiceItem {...item} />,
    []
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    []
  );

  const handleNewInvoicePress = useCallback(() => {
    router.push("/invoices/new");
  }, []);

  const renderEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyContent}>
          <IconListEmpty />
          <TypoGraphy variant="h1" style={styles.emptyTitle}>
            There is nothing here
          </TypoGraphy>
          <TypoGraphy variant="body2" style={styles.emptyText}>
            Create an invoice by clicking the
          </TypoGraphy>
          <TypoGraphy variant="body2" style={styles.emptyText}>
            <TypoGraphy variant="body2" style={styles.emptyBoldText}>
              New
            </TypoGraphy>{" "}
            button and get started
          </TypoGraphy>
        </View>
      </View>
    ),
    []
  );

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <TypoGraphy variant="h1" style={styles.headerTitle}>
            Invoices
          </TypoGraphy>
          <TypoGraphy variant="h3" style={styles.headerSubtitle}>
            {invoices.length ? `${invoices.length} invoices` : "No invoices"}
          </TypoGraphy>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.filterButton}>
            <TypoGraphy style={styles.filterText} variant="h2">
              Filter
            </TypoGraphy>
            <IconArrowDown width={12} height={12} />
          </Pressable>
          <Button
            variant="primary"
            leadingComponent={
              <View style={styles.newInvoiceIconContainer}>
                <IconPlus fontSize={24} />
              </View>
            }
            onPress={handleNewInvoicePress}
          >
            <TypoGraphy variant="h2">New</TypoGraphy>
          </Button>
        </View>
      </View>

      <FlatList
        data={invoices}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        removeClippedSubviews={true}
        initialNumToRender={10}
        refreshing={loading}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadInvoices} />
        }
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={renderEmptyComponent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.black[100],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  headerTitle: {},
  headerSubtitle: {},
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  filterText: {
    marginRight: 12,
  },
  newInvoiceIconContainer: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    height: 16,
  },
  listContentContainer: {
    paddingBottom: 24,
  },
  error: {
    color: "red",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContent: {
    alignItems: "center",
  },
  emptyTitle: {
    marginVertical: 24,
  },
  emptyText: {},
  emptyBoldText: {
    fontFamily: "SpartanMedium",
  },
});
