import { IconArrowDown, IconListEmpty, IconPlus } from "@/assets/svg";
import { colors } from "@/constants/Colors";
import invoiceService, { Invoice } from "@/service/invoice.service";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
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
    }

    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadInvoices();
    }, [])
  );

  const renderItem = ({ item }: { item: Invoice }) => <InvoiceItem {...item} />;

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  const renderSeparator = useMemo(() => {
    return () => <View style={{ height: 16 }} />;
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <TypoGraphy variant="h1" style={styles.title}>
            Invoices
          </TypoGraphy>
          <TypoGraphy variant="h3">
            {invoices.length ? `${invoices.length} invoices` : "No invoices"}
          </TypoGraphy>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <TypoGraphy style={{ marginRight: 12 }} variant="h2">
              Filter
            </TypoGraphy>
            <IconArrowDown width={12} height={12} />
          </Pressable>
          <Button
            variant="primary"
            leadingComponent={
              <View
                style={{
                  backgroundColor: "white",
                  padding: 12,
                  borderRadius: 100,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconPlus fontSize={24} />
              </View>
            }
            onPress={() => {
              router.push("/invoices/new");
            }}
          >
            <TypoGraphy variant="h2">New</TypoGraphy>
          </Button>
        </View>
      </View>

      {invoices.length > 0 ? (
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
          contentContainerStyle={{ paddingVertical: 24 }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={renderSeparator}
        />
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ alignItems: "center" }}>
            <IconListEmpty />
            <TypoGraphy variant="h1" style={{ marginVertical: 24 }}>
              There is nothing here
            </TypoGraphy>
            <TypoGraphy variant="body2">
              Create an invoice by clicking the
            </TypoGraphy>
            <TypoGraphy variant="body2">
              <TypoGraphy
                variant="body2"
                style={{ fontFamily: "SpartanMedium" }}
              >
                New
              </TypoGraphy>{" "}
              button and get started
            </TypoGraphy>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.black[100],
  },
  title: {},
  listItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  error: {
    color: "red",
  },
});
