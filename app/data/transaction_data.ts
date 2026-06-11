import { transactionData, type TransactionData } from "@proof.com/proof-vc-web";
import { type UseCase } from "@/app/lib/util";

export const TRANSACTION_DATA: Record<UseCase, TransactionData> = {
  merchant: transactionData.paymentItemized({
    title: "Drive Shaft",
    description: "The Roadhouse (18+), May 6 2026",
    currency: "USD",
    items: [
      { quantity: 2, unit_cost: 40.0, label: "General Admission" },
      { quantity: 2, unit_cost: 11.4, label: "Fees" },
    ],
  }),
  wire: transactionData.wireInstructions({
    recipient: {
      institution_name: "Crestline Financial",
      individual_name: "Acme Corp LLC",
      routing_number: "055000123",
      account_number: "7293",
    },
    source: {
      institution_name: "Sterling & Union",
      individual_name: "Sterling & Union",
      account_number: "4821",
      routing_number: "091000456",
    },
    amount: 5000,
    currency: "USD",
    memo: "Invoice #2024-089",
  }),
  ap2: transactionData.paymentMandate({
    payment_instrument: {
      type: "wallet",
      id: "did:example:visa-token-7829",
      description: "Visa ••••7829",
    },
    payee: {
      id: "did:example:summitco",
      name: "Summit Co",
      website: "summitco.com",
    },
    prompt_summary:
      "Find me a 4-season backpacking tent from Summit Co under $500",
    amount: 500,
    currency: "USD",
  }),
};
