import { CheckoutPageContent } from "@/components/CheckoutPageContent";
import { checkoutPageData } from "@/lib/storefront-data";

export const metadata = {
  title: "Payment Method",
};

export default function PaymentMethodPage() {
  return <CheckoutPageContent data={checkoutPageData} />;
}
