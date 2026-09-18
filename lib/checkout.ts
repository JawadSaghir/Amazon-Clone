import { getProductById } from "@/lib/catalog";
import type { CartLine, OrderTotals } from "@/types";

export function calculateTotals(items: CartLine[], couponCode?: string): OrderTotals {
  const subtotalInr = items.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product ? product.priceInr * item.quantity : 0);
  }, 0);
  const discountInr = couponCode?.toUpperCase() === "8XWELCOME" ? Math.min(750, Math.round(subtotalInr * 0.08)) : 0;
  const shippingInr = subtotalInr - discountInr > 1999 ? 0 : 149;
  const taxableInr = Math.max(0, subtotalInr - discountInr + shippingInr);
  const taxInr = Math.round(taxableInr * 0.18);
  const totalInr = taxableInr + taxInr;

  return { subtotalInr, discountInr, shippingInr, taxInr, totalInr };
}
