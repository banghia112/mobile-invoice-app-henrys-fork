import { InvoiceForm } from "@/components/InvoiceForm";
import invoiceService, { Invoice } from "@/service/invoice.service";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";

export default function EditInvoiceScreen() {
  const { id } = useLocalSearchParams();
  console.log("🚀 ~ EditInvoiceScreen ~ id:", id);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  useEffect(() => {
    const getInvoice = async () => {
      const res = await invoiceService.getInvoiceById(id as string);
      if (res) {
        setInvoice(res);
      }
    };
    getInvoice();
  }, []);
  console.log("🚀 ~ EditInvoiceScreen ~ invoice:", invoice);

  if (!invoice) {
    return null;
  }

  return <InvoiceForm type="edit" initialInvoice={invoice} />;
}
