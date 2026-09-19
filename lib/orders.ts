import type { Order, OrderItem, User } from "@prisma/client";

import { getProductById } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import type { AddressInput, CartLine, OrderTotals } from "@/types";

type CheckoutToken = {
  email?: string | null;
  name?: string | null;
  role?: string | null;
};

type CheckoutUser = {
  id: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "ADMIN";
};

type OrderWithItems = Order & {
  items: OrderItem[];
};

type DemoOrderItem = {
  id: string;
  productId: string;
  titleSnapshot: string;
  image: string;
  quantity: number;
  unitPriceInr: number;
};

type DemoOrder = {
  id: string;
  userId: string;
  status: "PENDING";
  paymentStatus: "UNPAID";
  subtotalInr: number;
  discountInr: number;
  shippingInr: number;
  taxInr: number;
  totalInr: number;
  currency: "INR";
  addressSnapshot: AddressInput;
  createdAt: Date;
  items: DemoOrderItem[];
};

type SerializedOrder = ReturnType<typeof serializeOrder>;

const globalForOrders = globalThis as unknown as { demoOrders?: DemoOrder[] };

function getDemoOrders() {
  globalForOrders.demoOrders ??= [];
  return globalForOrders.demoOrders;
}

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export async function resolveCheckoutUser(token: CheckoutToken): Promise<CheckoutUser | null> {
  const email = token.email?.trim().toLowerCase();
  if (!email) return null;

  const name = token.name?.trim() || (token.role === "ADMIN" ? "Demo Admin" : "Demo Customer");
  const role = token.role === "ADMIN" ? "ADMIN" : "CUSTOMER";

  if (!hasDatabaseUrl()) {
    return { id: `demo-${email}`, email, name, role };
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: { name, role },
    create: { email, name, role }
  });

  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

export async function createCheckoutOrder(params: {
  user: CheckoutUser;
  items: CartLine[];
  totals: OrderTotals;
  address: AddressInput;
}) {
  const itemSnapshots = params.items.map((item) => {
    const product = getProductById(item.productId);
    if (!product) {
      throw new Error(`Unknown product ${item.productId}`);
    }

    return {
      productId: product.id,
      titleSnapshot: product.title,
      image: product.images[0] ?? "",
      quantity: item.quantity,
      unitPriceInr: product.priceInr
    };
  });

  if (!hasDatabaseUrl()) {
    const order: DemoOrder = {
      id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
      userId: params.user.id,
      status: "PENDING",
      paymentStatus: "UNPAID",
      subtotalInr: params.totals.subtotalInr,
      discountInr: params.totals.discountInr,
      shippingInr: params.totals.shippingInr,
      taxInr: params.totals.taxInr,
      totalInr: params.totals.totalInr,
      currency: "INR",
      addressSnapshot: params.address,
      createdAt: new Date(),
      items: itemSnapshots.map((item, index) => ({ id: `${index}-${item.productId}`, ...item }))
    };
    getDemoOrders().unshift(order);
    return order;
  }

  return prisma.order.create({
    data: {
      userId: params.user.id,
      subtotalInr: params.totals.subtotalInr,
      discountInr: params.totals.discountInr,
      shippingInr: params.totals.shippingInr,
      taxInr: params.totals.taxInr,
      totalInr: params.totals.totalInr,
      currency: "INR",
      addressSnapshot: params.address,
      items: { create: itemSnapshots }
    },
    include: { items: true }
  });
}

export async function getOrdersForUser(user: CheckoutUser, orderId?: string | null): Promise<SerializedOrder[]> {
  if (!hasDatabaseUrl()) {
    return getDemoOrders()
      .filter((order) => order.userId === user.id && (!orderId || order.id === orderId))
      .map((order) => serializeOrder(order, user));
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: user.id,
      ...(orderId ? { id: orderId } : {})
    },
    include: { items: true },
    orderBy: { createdAt: "desc" }
  });

  return orders.map((order) => serializeOrder(order, user));
}

export function formatOrderNumber(orderId: string) {
  return `8X-${orderId.slice(-6).toUpperCase()}`;
}

export function serializeOrder(order: OrderWithItems | DemoOrder, user?: Pick<User, "email" | "name"> | CheckoutUser | null) {
  return {
    id: order.id,
    orderNumber: formatOrderNumber(order.id),
    status: order.status,
    paymentStatus: order.paymentStatus,
    subtotalInr: order.subtotalInr,
    discountInr: order.discountInr,
    shippingInr: order.shippingInr,
    taxInr: order.taxInr,
    totalInr: order.totalInr,
    currency: order.currency,
    address: order.addressSnapshot,
    customer: user ? { name: user.name, email: user.email } : null,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      title: item.titleSnapshot,
      image: item.image,
      quantity: item.quantity,
      unitPriceInr: item.unitPriceInr
    }))
  };
}
