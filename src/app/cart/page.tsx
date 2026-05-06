import { CartPageContent } from "@/components/CartPageContent";
import { cartPageData } from "@/lib/storefront-data";

export const metadata = {
  title: "Cart",
};

export default function CartPage() {
  return <CartPageContent data={cartPageData} />;
}
