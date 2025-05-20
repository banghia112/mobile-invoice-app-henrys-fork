import { colors } from "@/constants/Colors";
import { Invoice } from "@/service/invoice.service";
import {
  capitalizeString,
  formatDisplayDate,
  formatPayment,
} from "@/utils/formatter.utils";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { TypoGraphy } from "../TypoGraphy";
import { STATUS_TO_COLOR_MAP } from "./invoiceitem.constants";

interface InvoiceItemProps extends Invoice {}

export const InvoiceItem = (props: InvoiceItemProps) => {
  const { id, clientName, paymentDue, total, status } = props;

  const handlePress = useCallback(() => {
    router.push(`/invoices/${id}`);
  }, [id]);

  const statusColor = STATUS_TO_COLOR_MAP[status];

  return (
    <Pressable style={styles.pressable} onPress={handlePress}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TypoGraphy variant="body1">
            #<TypoGraphy variant="h3">{id}</TypoGraphy>
          </TypoGraphy>
          <TypoGraphy variant="body1">{clientName}</TypoGraphy>
        </View>
        <View style={styles.details}>
          <View>
            <TypoGraphy variant="body2">
              Due {formatDisplayDate(paymentDue)}
            </TypoGraphy>
            <TypoGraphy variant="h1">{formatPayment(total)}</TypoGraphy>
          </View>
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
              {capitalizeString(status)}
            </TypoGraphy>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 12,
    overflow: "hidden", // To make sure the borderRadius is respected when pressed
  },
  container: {
    justifyContent: "space-between",
    padding: 24,
    backgroundColor: colors.black[200],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  details: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    backgroundColor: "transparent", // Will be set dynamically
    marginRight: 12,
  },
});
