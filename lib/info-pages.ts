export type InfoPage = {
  slug: string;
  title: string;
  eyebrow: string;
  body: string;
  bullets: string[];
};

export const infoPages: InfoPage[] = [
  {
    slug: "about-8x",
    title: "About 8x Bazaar",
    eyebrow: "Get to Know Us",
    body: "8x Bazaar is a demo marketplace experience for browsing electronics, home goods, fashion, grocery, beauty, and everyday essentials.",
    bullets: ["Curated product catalog", "INR pricing with regional marketplace styling", "Demo checkout and account flows"]
  },
  {
    slug: "careers",
    title: "Careers",
    eyebrow: "Get to Know Us",
    body: "Explore how commerce, design, engineering, and operations come together in a modern marketplace experience.",
    bullets: ["Retail operations", "Frontend engineering", "Customer experience"]
  },
  {
    slug: "press-releases",
    title: "Press Releases",
    eyebrow: "Get to Know Us",
    body: "Find product updates, launch notes, and marketplace announcements for the 8x Bazaar demo storefront.",
    bullets: ["Launch updates", "Feature announcements", "Marketplace news"]
  },
  {
    slug: "8x-labs",
    title: "8x Labs",
    eyebrow: "Get to Know Us",
    body: "8x Labs highlights experiments in search, merchandising, checkout, and account experiences.",
    bullets: ["Personalized discovery", "Retail UI experiments", "Checkout prototypes"]
  },
  {
    slug: "facebook",
    title: "Facebook",
    eyebrow: "Connect with Us",
    body: "Follow 8x Bazaar updates and shopping stories through our social channels.",
    bullets: ["Product highlights", "Seasonal campaigns", "Customer stories"]
  },
  {
    slug: "twitter",
    title: "Twitter",
    eyebrow: "Connect with Us",
    body: "Track short-form announcements, service updates, and marketplace notes.",
    bullets: ["Release notes", "Service updates", "Deal alerts"]
  },
  {
    slug: "instagram",
    title: "Instagram",
    eyebrow: "Connect with Us",
    body: "Browse visual inspiration across home, fashion, kitchen, and beauty categories.",
    bullets: ["Style inspiration", "Home ideas", "New arrival previews"]
  },
  {
    slug: "sell-on-8x",
    title: "Sell on 8x",
    eyebrow: "Make Money with Us",
    body: "Learn how sellers can list products, manage inventory, and reach shoppers in this demo marketplace flow.",
    bullets: ["Product listings", "Seller fulfillment", "Marketplace promotions"]
  },
  {
    slug: "fulfilment-by-8x",
    title: "Fulfilment by 8x",
    eyebrow: "Make Money with Us",
    body: "A demo overview of storage, packing, shipping, and delivery support for sellers.",
    bullets: ["Inventory handling", "Fast dispatch", "Delivery tracking"]
  },
  {
    slug: "advertise-your-products",
    title: "Advertise Your Products",
    eyebrow: "Make Money with Us",
    body: "Promote products in marketplace placements, deal modules, and category shelves.",
    bullets: ["Sponsored placements", "Deal modules", "Category campaigns"]
  },
  {
    slug: "your-account",
    title: "Your Account",
    eyebrow: "Let Us Help You",
    body: "Manage orders, profile details, wishlist, addresses, payments, notifications, and account security.",
    bullets: ["Orders and wishlist", "Addresses and payments", "Profile and security"]
  },
  {
    slug: "returns-centre",
    title: "Returns Centre",
    eyebrow: "Let Us Help You",
    body: "Review demo return policies and learn how return workflows would work in a production marketplace.",
    bullets: ["Return eligibility", "Refund timing", "Replacement options"]
  },
  {
    slug: "payments",
    title: "Payments",
    eyebrow: "Let Us Help You",
    body: "Understand the demo payment flow, currency display, checkout totals, taxes, discounts, and shipping.",
    bullets: ["Secure test checkout", "Coupons and totals", "INR and PKR display"]
  },
  {
    slug: "help",
    title: "Help",
    eyebrow: "Let Us Help You",
    body: "Find support information for browsing, search, cart, checkout, orders, and account access.",
    bullets: ["Shopping help", "Account help", "Checkout help"]
  },
  {
    slug: "conditions-of-use",
    title: "Conditions of Use",
    eyebrow: "Legal",
    body: "These demo terms explain acceptable use for the 8x Bazaar storefront prototype.",
    bullets: ["Demo-only experience", "No real payments", "No production fulfillment"]
  },
  {
    slug: "privacy-notice",
    title: "Privacy Notice",
    eyebrow: "Legal",
    body: "This demo privacy notice describes local test data, browser storage, and account session behavior.",
    bullets: ["Local browser storage", "Demo account sessions", "No real customer data required"]
  },
  {
    slug: "interest-based-ads",
    title: "Interest-Based Ads",
    eyebrow: "Legal",
    body: "This page explains how interest-based merchandising placements could work in a production marketplace.",
    bullets: ["Personalized shelves", "Sponsored modules", "Preference controls"]
  }
];

export function getInfoPage(slug: string) {
  return infoPages.find((page) => page.slug === slug);
}
