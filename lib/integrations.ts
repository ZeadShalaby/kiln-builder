export type IntegrationId =
  | "stripe"
  | "shopify"
  | "gmail"
  | "slack"
  | "sheets";

export interface Integration {
  id: IntegrationId;
  name: string;
  blurb: string;
  /** What this integration means for the AI when it's selected — this is what gets
   *  injected into the system prompt, not just the name. */
  context: string;
}

export const INTEGRATIONS: Integration[] = [
  {
    id: "stripe",
    name: "Stripe",
    blurb: "Payments & billing",
    context:
      "Stripe is available for payments, subscriptions, invoicing, and billing. Assume the product can charge cards, manage plans, and track revenue events.",
  },
  {
    id: "shopify",
    name: "Shopify",
    blurb: "Storefront & orders",
    context:
      "Shopify is available for product catalog, storefront, and order data. Assume the product can read/sync orders, inventory, and customer purchase history.",
  },
  {
    id: "gmail",
    name: "Gmail",
    blurb: "Email & reports",
    context:
      "Gmail is available for sending and reading email. Assume the product can send automated reports, receipts, or notifications, and can parse incoming email if needed.",
  },
  {
    id: "slack",
    name: "Slack",
    blurb: "Team notifications",
    context:
      "Slack is available for team messaging. Assume the product can post alerts, digests, or approvals into a Slack channel.",
  },
  {
    id: "sheets",
    name: "Google Sheets",
    blurb: "Data export",
    context:
      "Google Sheets is available for structured data export/import. Assume the product can push rows out for reporting or pull config/data in from a sheet.",
  },
];

export function integrationsById(ids: IntegrationId[]): Integration[] {
  const set = new Set(ids);
  return INTEGRATIONS.filter((i) => set.has(i.id));
}
