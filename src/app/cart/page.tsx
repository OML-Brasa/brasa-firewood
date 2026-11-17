import { CartClient } from "@/components/CartClient";
import { CheckoutStepper } from "@/components/CheckoutStepper";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Newsletter } from "@/components/Newsletter";
import { getLocale } from "@/lib/getLocale";
import { getCheckoutSettings } from "@/lib/getCheckoutSettings";
import { getAccessories } from "@/lib/getProducts";

export const revalidate = 60;

export default async function CartPage() {
  const locale = await getLocale();
  const [s, accessories] = await Promise.all([getCheckoutSettings(locale), getAccessories(locale)]);
  return (
    <div className="flex flex-col bg-background">
      <Navbar />
      <CheckoutStepper step={1} />
      <CartClient accessories={accessories} trustBadges={s.trustBadges} />
      <Newsletter />
      <Footer />
    </div>
  );
}
