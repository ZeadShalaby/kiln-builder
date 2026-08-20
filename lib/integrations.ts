export type IntegrationId =
  | "stripe"
  | "shopify"
  | "gmail"
  | "slack"
  | "sheets";

export interface Integration {
  id: IntegrationId;
  name: string;
  /** What this integration means for the AI when it's selected — this is what gets
   *  injected into the system prompt, not just the name. */
  context: string;
  /** Brand tile styling for the selector UI */
  tileBg: string;
  tileColor: string;
  letter: string;
}

export const INTEGRATIONS: Integration[] = [
  {
    id: "stripe",
    name: "Stripe",
    context:
      "Stripe is available for payments, subscriptions, invoicing, and billing. Assume the product can charge cards, manage plans, and track revenue events.",
    tileBg: "#635BFF",
    tileColor: "#FFFFFF",
    letter: "S",
  },
  {
    id: "shopify",
    name: "Shopify",
    context:
      "Shopify is available for product catalog, storefront, and order data. Assume the product can read/sync orders, inventory, and customer purchase history.",
    tileBg: "#95BF47",
    tileColor: "#FFFFFF",
    letter: "S",
  },
  {
    id: "gmail",
    name: "Gmail",
    context:
      "Gmail is available for sending and reading email. Assume the product can send automated reports, receipts, or notifications, and can parse incoming email if needed.",
    tileBg: "#EA4335",
    tileColor: "#FFFFFF",
    letter: "M",
  },
  {
    id: "slack",
    name: "Slack",
    context:
      "Slack is available for team messaging. Assume the product can post alerts, digests, or approvals into a Slack channel.",
    tileBg: "#4A154B",
    tileColor: "#FFFFFF",
    letter: "#",
  },
  {
    id: "sheets",
    name: "Google Sheets",
    context:
      "Google Sheets is available for structured data export/import. Assume the product can push rows out for reporting or pull config/data in from a sheet.",
    tileBg: "#0F9D58",
    tileColor: "#FFFFFF",
    letter: "G",
  },
];

export function integrationsById(ids: IntegrationId[]): Integration[] {
  const set = new Set(ids);
  return INTEGRATIONS.filter((i) => set.has(i.id));
}
