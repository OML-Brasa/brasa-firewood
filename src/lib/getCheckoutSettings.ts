import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

import { checkoutDefaults, type CheckoutSettings } from "./checkoutDefaults";

const query = `*[_type == "checkoutSettings"][0]{
  shippingMethods[]{ name, description, price },
  trustBadges[]{ title, description },
  whatsNext[]{ title, description },
  accessories[]{ name, description, price, image },
  taxRate, financeText, supportPhone, supportEmail
}`;

/** Fetch checkout settings from Sanity, falling back to code defaults. */
export async function getCheckoutSettings(): Promise<CheckoutSettings> {
  const doc = await client.fetch(query).catch(() => null);
  if (!doc) return checkoutDefaults;
  return {
    shippingMethods: doc.shippingMethods?.length ? doc.shippingMethods : checkoutDefaults.shippingMethods,
    trustBadges: doc.trustBadges?.length ? doc.trustBadges : checkoutDefaults.trustBadges,
    whatsNext: doc.whatsNext?.length ? doc.whatsNext : checkoutDefaults.whatsNext,
    accessories: doc.accessories?.length
      ? doc.accessories.map((a: { name: string; description: string; price: number; image?: Parameters<typeof urlFor>[0] }) => ({
          name: a.name,
          description: a.description,
          price: a.price,
          image: a.image ? urlFor(a.image).width(600).auto("format").url() : null,
        }))
      : checkoutDefaults.accessories,
    taxRate: doc.taxRate ?? checkoutDefaults.taxRate,
    financeText: doc.financeText ?? checkoutDefaults.financeText,
    supportPhone: doc.supportPhone ?? checkoutDefaults.supportPhone,
    supportEmail: doc.supportEmail ?? checkoutDefaults.supportEmail,
  };
}
