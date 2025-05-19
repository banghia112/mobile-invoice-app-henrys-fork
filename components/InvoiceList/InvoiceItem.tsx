import { colors } from "@/constants/Colors";
import { Invoice } from "@/service/invoice.service";
import {
  capitalizeString,
  formatDate,
  formatPayment,
} from "@/utils/formatter.utils";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { TypoGraphy } from "../TypoGraphy";
import { STATUS_TO_COLOR_MAP } from "./invoiceitem.constants";

export const InvoiceItem = (props: Invoice) => {
  const { id, clientName, paymentDue, total, status } = props;
  const onPress = () => {
    router.push(`/invoices/${id}`);
  };

  const statusColor = STATUS_TO_COLOR_MAP[status];
  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <TypoGraphy variant="body1">
            #<TypoGraphy variant="h3">{id}</TypoGraphy>
          </TypoGraphy>
          <TypoGraphy variant="body1">{clientName}</TypoGraphy>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <TypoGraphy variant="body2">
              Due {formatDate(paymentDue)}
            </TypoGraphy>
            <TypoGraphy variant="h1">{formatPayment(total)}</TypoGraphy>
          </View>
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
              {capitalizeString(status)}
            </TypoGraphy>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    padding: 24,
    backgroundColor: colors.black[200],
    borderRadius: 12,
  },
});
