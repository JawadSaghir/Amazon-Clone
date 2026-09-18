import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const INR_TO_PKR = 3.35;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function inrToPkr(value: number) {
  return Math.round(value * INR_TO_PKR);
}

export function formatCurrency(value: number, currency: "INR" | "PKR") {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-PK", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(value);
}

export function formatMoney(valueInr: number) {
  return `${formatCurrency(valueInr, "INR")} / ${formatCurrency(inrToPkr(valueInr), "PKR")}`;
}

export function discountPercent(priceInr: number, mrpInr: number) {
  if (mrpInr <= priceInr) return 0;
  return Math.round(((mrpInr - priceInr) / mrpInr) * 100);
}

export function absoluteUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${base}${path}`;
}
