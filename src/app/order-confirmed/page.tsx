import { CheckoutStepper } from "@/components/CheckoutStepper";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Newsletter } from "@/components/Newsletter";
import { OrderConfirmedClient } from "@/components/OrderConfirmedClient";
import { getCheckoutSettings } from "@/lib/getCheckoutSettings";

export const revalidate = 60;

export default async function OrderConfirmedPage() {
  const s = await getCheckoutSettings();
  return (
    <div className="flex flex-col bg-background">
      <Navbar />
      <CheckoutStepper step={3} />
      <OrderConfirmedClient whatsNext={s.whatsNext} shippingMethods={s.shippingMethods} supportPhone={s.supportPhone} supportEmail={s.supportEmail} />
      <Newsletter />
      <Footer />
    </div>
  );
}
