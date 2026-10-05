import { CartClient } from "@/components/CartClient";
import { CheckoutStepper } from "@/components/CheckoutStepper";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Newsletter } from "@/components/Newsletter";
import { getCheckoutSettings } from "@/lib/getCheckoutSettings";

export const revalidate = 60;

export default async function CartPage() {
  const s = await getCheckoutSettings();
  return (
    <div className="flex flex-col bg-background">
      <Navbar />
      <CheckoutStepper step={1} />
      <CartClient accessories={s.accessories} trustBadges={s.trustBadges} financeText={s.financeText} />
      <Newsletter />
      <Footer />
    </div>
  );
}
