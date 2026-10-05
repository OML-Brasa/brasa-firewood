export type ShippingMethod = { name: string; description: string; price: number };
export type TrustBadge = { title: string; description: string };
export type WhatsNextStep = { title: string; description: string };
export type Accessory = { name: string; description: string; price: number; image: string | null };

export type CheckoutSettings = {
  shippingMethods: ShippingMethod[];
  trustBadges: TrustBadge[];
  whatsNext: WhatsNextStep[];
  accessories: Accessory[];
  taxRate: number;
  financeText: string;
  supportPhone: string;
  supportEmail: string;
};

/** Code defaults for the checkout flow — used when the Sanity `checkoutSettings`
 *  document is missing, and as the source the seed script writes into Sanity. */
export const checkoutDefaults: CheckoutSettings = {
  shippingMethods: [
    { name: "Standard Freight Delivery", description: "Tailgate delivery via partner carrier. Curbside drop-off.", price: 0 },
    { name: "Express Insured Shipping", description: "Prioritized carrier dispatch. Fully protected transit.", price: 149 },
    { name: "White Glove Delivery & Setup", description: "Scheduled delivery, unboxing, assembly, and precise stand installation by outdoor oven specialists.", price: 349 },
  ],
  trustBadges: [
    { title: "100% Secure Checkout", description: "Encrypted transaction processing." },
    { title: "2-Year Premium Warranty", description: "Comprehensive Brasa coverage." },
    { title: "Free Design Consultation", description: "Speak with our outdoor oven experts." },
  ],
  whatsNext: [
    { title: "Confirmation Email", description: "A receipt and detailed order confirmation has been dispatched to your inbox." },
    { title: "Order Processing", description: "Our refractory specialists are preparing your Brasa oven for safe freight transport (1–2 business days)." },
    { title: "Shipping Notification", description: "You will receive an email containing a dedicated freight tracking number once your oven leaves our facility." },
    { title: "Delivery & Wood-Fired Feast!", description: "The carrier will call to schedule a convenient curbside delivery window. Fire up and enjoy!" },
  ],
  accessories: [
    { name: "Cast Iron Door", description: "With heat-rated glass", price: 180, image: null },
    { name: "Oven Thermometer", description: "Per-chamber dial gauge", price: 45, image: null },
    { name: "Stainless Chimney Cap", description: "Weather + spark guard", price: 60, image: null },
    { name: "Flue Damper Set", description: "Cast-iron airflow control", price: 35, image: null },
  ],
  taxRate: 0.08,
  financeText: "As Low As $405/Mo With Affirm",
  supportPhone: "1-800-555-0199",
  supportEmail: "support@brasaoutdoor.com",
};
