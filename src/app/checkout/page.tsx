import { CheckoutClient } from "@/components/CheckoutClient";
import { CheckoutStepper } from "@/components/CheckoutStepper";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Newsletter } from "@/components/Newsletter";
import { getCheckoutSettings } from "@/lib/getCheckoutSettings";

export const revalidate = 60;

export default async function CheckoutPage() {
  const s = await getCheckoutSettings();
  return (
    <div className="flex flex-col bg-background">
      <Navbar />
      <CheckoutStepper step={2} />
      <CheckoutClient shippingMethods={s.shippingMethods} trustBadges={s.trustBadges} financeText={s.financeText} taxRate={s.taxRate} />
      <Newsletter />
      <Footer />
    </div>
  );
}
