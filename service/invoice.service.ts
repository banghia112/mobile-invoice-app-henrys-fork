import { generateInvoiceId } from "@/helper/invoice.helper";
import { getFromStorage, setToStorage } from "@/utils/storage.utils";

const INVOICE_STORAGE_KEY = "invoices";

export interface Item {
  name: string;
  quantity: number;
  price: number;
  total: number;
}
export interface Invoice {
  id: string;
  createdAt: string;
  paymentDue: string;
  description: string;
  paymentTerms: number;
  clientName: string;
  clientEmail: string;
  status: "paid" | "pending" | "draft";
  senderAddress: {
    street: string;
    city: string;
    postCode: string;
    country: string;
  };
  clientAddress: {
    street: string;
    city: string;
    postCode: string;
    country: string;
  };
  items: Item[];
  total: number;
}

const invoiceService = {
  async initialize(): Promise<void> {
    try {
      const storedInvoices = await getFromStorage<Invoice[]>(
        INVOICE_STORAGE_KEY
      );
      if (!storedInvoices) {
        const initialInvoices: Invoice[] = [
          {
            id: "RT3080",
            createdAt: "2021-08-18",
            paymentDue: "2021-08-19",
            description: "Re-branding",
            paymentTerms: 1,
            clientName: "Jensen Huang",
            clientEmail: "jensenh@mail.com",
            status: "paid",
            senderAddress: {
              street: "19 Union Terrace",
              city: "London",
              postCode: "E1 3EZ",
              country: "United Kingdom",
            },
            clientAddress: {
              street: "106 Kendell Street",
              city: "Sharrington",
              postCode: "NR24 5WQ",
              country: "United Kingdom",
            },
            items: [
              {
                name: "Brand Guidelines",
                quantity: 1,
                price: 1800.9,
                total: 1800.9,
              },
            ],
            total: 1800.9,
          },
          {
            id: "XM9141",
            createdAt: "2021-08-21",
            paymentDue: "2021-09-20",
            description: "Graphic Design",
            paymentTerms: 30,
            clientName: "Alex Grim",
            clientEmail: "alexgrim@mail.com",
            status: "pending",
            senderAddress: {
              street: "19 Union Terrace",
              city: "London",
              postCode: "E1 3EZ",
              country: "United Kingdom",
            },
            clientAddress: {
              street: "84 Church Way",
              city: "Bradford",
              postCode: "BD1 9PB",
              country: "United Kingdom",
            },
            items: [
              {
                name: "Banner Design",
                quantity: 1,
                price: 156.0,
                total: 156.0,
              },
              {
                name: "Email Design",
                quantity: 2,
                price: 200.0,
                total: 400.0,
              },
            ],
            total: 556.0,
          },
          {
            id: "RG0314",
            createdAt: "2021-09-24",
            paymentDue: "2021-10-01",
            description: "Website Redesign",
            paymentTerms: 7,
            clientName: "John Morrison",
            clientEmail: "jm@myco.com",
            status: "paid",
            senderAddress: {
              street: "19 Union Terrace",
              city: "London",
              postCode: "E1 3EZ",
              country: "United Kingdom",
            },
            clientAddress: {
              street: "79 Dover Road",
              city: "Westhall",
              postCode: "IP19 3PF",
              country: "United Kingdom",
            },
            items: [
              {
                name: "Website Redesign",
                quantity: 1,
                price: 14002.33,
                total: 14002.33,
              },
            ],
            total: 14002.33,
          },
          {
            id: "RT2080",
            createdAt: "2021-10-11",
            paymentDue: "2021-10-12",
            description: "Logo Concept",
            paymentTerms: 1,
            clientName: "Alysa Werner",
            clientEmail: "alysa@email.co.uk",
            status: "pending",
            senderAddress: {
              street: "19 Union Terrace",
              city: "London",
              postCode: "E1 3EZ",
              country: "United Kingdom",
            },
            clientAddress: {
              street: "63 Warwick Road",
              city: "Carlisle",
              postCode: "CA20 2TG",
              country: "United Kingdom",
            },
            items: [
              {
                name: "Logo Sketches",
                quantity: 1,
                price: 102.04,
                total: 102.04,
              },
            ],
            total: 102.04,
          },
          {
            id: "AA1449",
            createdAt: "2021-10-7",
            paymentDue: "2021-10-14",
            description: "Re-branding",
            paymentTerms: 7,
            clientName: "Mellisa Clarke",
            clientEmail: "mellisa.clarke@example.com",
            status: "pending",
            senderAddress: {
              street: "19 Union Terrace",
              city: "London",
              postCode: "E1 3EZ",
              country: "United Kingdom",
            },
            clientAddress: {
              street: "46 Abbey Row",
              city: "Cambridge",
              postCode: "CB5 6EG",
              country: "United Kingdom",
            },
            items: [
              {
                name: "New Logo",
                quantity: 1,
                price: 1532.33,
                total: 1532.33,
              },
              {
                name: "Brand Guidelines",
                quantity: 1,
                price: 2500.0,
                total: 2500.0,
              },
            ],
            total: 4032.33,
          },
          {
            id: "TY9141",
            createdAt: "2021-10-01",
            paymentDue: "2021-10-31",
            description: "Landing Page Design",
            paymentTerms: 30,
            clientName: "Thomas Wayne",
            clientEmail: "thomas@dc.com",
            status: "pending",
            senderAddress: {
              street: "19 Union Terrace",
              city: "London",
              postCode: "E1 3EZ",
              country: "United Kingdom",
            },
            clientAddress: {
              street: "3964  Queens Lane",
              city: "Gotham",
              postCode: "60457",
              country: "United States of America",
            },
            items: [
              {
                name: "Web Design",
                quantity: 1,
                price: 6155.91,
                total: 6155.91,
              },
            ],
            total: 6155.91,
          },
          {
            id: "FV2353",
            createdAt: "2021-11-05",
            paymentDue: "2021-11-12",
            description: "Logo Re-design",
            paymentTerms: 7,
            clientName: "Anita Wainwright",
            clientEmail: "",
            status: "draft",
            senderAddress: {
              street: "19 Union Terrace",
              city: "London",
              postCode: "E1 3EZ",
              country: "United Kingdom",
            },
            clientAddress: {
              street: "",
              city: "",
              postCode: "",
              country: "",
            },
            items: [
              {
                name: "Logo Re-design",
                quantity: 1,
                price: 3102.04,
                total: 3102.04,
              },
            ],
            total: 3102.04,
          },
        ];
        await setToStorage<Invoice[]>(INVOICE_STORAGE_KEY, initialInvoices);
      }
    } catch (error) {
      console.error("Failed to initialize invoice data:", error);
      throw error;
    }
  },

  /**
   * Retrieves all invoices from storage.
   * @returns An array of invoices or an empty array.
   */
  async getInvoices(): Promise<Invoice[]> {
    try {
      const storedInvoices = await getFromStorage<Invoice[]>(
        INVOICE_STORAGE_KEY
      );
      return storedInvoices || [];
    } catch (error) {
      console.error("Failed to get invoices:", error);
      throw error;
    }
  },

  /**
   * Retrieves a single invoice by its ID.
   * @param id The ID of the invoice to retrieve.
   * @returns An Invoice
   */
  async getInvoiceById(id: string): Promise<Invoice | null> {
    try {
      const invoices = await getFromStorage<Invoice[]>(INVOICE_STORAGE_KEY);
      if (invoices) {
        const invoice = invoices.find((inv) => inv.id === id);
        return invoice || null;
      }
      return null;
    } catch (error) {
      console.error(`Failed to get invoice with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Adds a new invoice to the storage.
   * @param invoice The invoice object to add.
   * @returns A promise that resolves to the newly created invoice ID.
   */
  async addInvoice(invoice: Omit<Invoice, "id">): Promise<string> {
    try {
      const invoices =
        (await getFromStorage<Invoice[]>(INVOICE_STORAGE_KEY)) || [];

      const fullInvoice: Invoice = { ...invoice, id: generateInvoiceId() };
      const updatedInvoices = [fullInvoice, ...invoices];
      await setToStorage<Invoice[]>(INVOICE_STORAGE_KEY, updatedInvoices);
      return "Add invoice successfully";
    } catch (error) {
      console.error("Failed to add invoice:", error);
      throw error;
    }
  },

  /**
   * Adds a new invoice to the storage.
   * @param invoice The invoice object to add.
   * @returns A promise that resolves to the newly created invoice ID.
   */
  async addDraftInvoice(
    invoice: Partial<Omit<Invoice, "id">>
  ): Promise<string> {
    try {
      const invoices =
        (await getFromStorage<Invoice[]>(INVOICE_STORAGE_KEY)) || [];

      const fullInvoice: Partial<Invoice> = {
        ...invoice,
        id: generateInvoiceId(),
      };
      const updatedInvoices = [fullInvoice, ...invoices];
      await setToStorage<Partial<Invoice>[]>(
        INVOICE_STORAGE_KEY,
        updatedInvoices
      );
      return "Add invoice successfully";
    } catch (error) {
      console.error("Failed to add invoice:", error);
      throw error;
    }
  },

  /**
   * Updates an existing invoice.
   * @param id The ID of the invoice to update.
   * @param updatedInvoice The updated invoice object.
   * @returns A promise that resolves to true if the invoice was updated, false otherwise.
   */
  async updateInvoice(id: string, updatedInvoice: Invoice): Promise<boolean> {
    try {
      const invoices = await getFromStorage<Invoice[]>(INVOICE_STORAGE_KEY);
      if (!invoices) {
        return false;
      }

      const updatedInvoices = invoices.map((inv) =>
        inv.id === id ? updatedInvoice : inv
      );
      const isUpdated = updatedInvoices.some((inv) => inv.id === id);

      await setToStorage<Invoice[]>(INVOICE_STORAGE_KEY, updatedInvoices);
      return isUpdated;
    } catch (error) {
      console.error(`Failed to update invoice with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deletes an invoice by its ID.
   * @param id The ID of the invoice to delete.
   * @returns A promise that resolves to true if the invoice was deleted, false otherwise.
   */
  async deleteInvoice(id: string): Promise<boolean> {
    try {
      const invoices = await getFromStorage<Invoice[]>(INVOICE_STORAGE_KEY);
      if (!invoices) {
        return false;
      }

      const updatedInvoices = invoices.filter((inv) => inv.id !== id);
      const isDeleted = invoices.length !== updatedInvoices.length;
      await setToStorage<Invoice[]>(INVOICE_STORAGE_KEY, updatedInvoices);
      return isDeleted;
    } catch (error) {
      console.error(`Failed to delete invoice with ID ${id}:`, error);
      throw error;
    }
  },
};

export default invoiceService;
