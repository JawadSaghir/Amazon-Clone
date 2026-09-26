import { MongoClient, ObjectId } from "mongodb";

import { getProductsByIds } from "@/lib/catalog";
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
  currency: "PKR";
  addressSnapshot: AddressInput;
  createdAt: Date;
  items: DemoOrderItem[];
};

type SerializedOrder = ReturnType<typeof serializeOrder>;

type PersistentOrderItem = {
  id: string;
  orderId: string;
  productId: string;
  titleSnapshot: string;
  image: string;
  quantity: number;
  unitPriceInr: number;
};

type PersistentOrder = {
  id: string;
  userId: string;
  status: "PENDING";
  paymentStatus: "UNPAID";
  subtotalInr: number;
  discountInr: number;
  shippingInr: number;
  taxInr: number;
  totalInr: number;
  currency: "PKR";
  addressSnapshot: AddressInput;
  createdAt: Date;
  updatedAt: Date;
  items: PersistentOrderItem[];
};

type MongoUserDocument = {
  _id: ObjectId;
  email: string;
  name: string;
  role: "CUSTOMER" | "ADMIN";
  createdAt?: Date;
  updatedAt?: Date;
};

type MongoOrderDocument = {
  _id: ObjectId;
  userId: ObjectId;
  status: "PENDING";
  paymentStatus: "UNPAID";
  subtotalInr: number;
  discountInr: number;
  shippingInr: number;
  taxInr: number;
  totalInr: number;
  currency: "PKR";
  addressSnapshot: AddressInput;
  createdAt: Date;
  updatedAt: Date;
};

type MongoOrderItemDocument = {
  _id: ObjectId;
  orderId: ObjectId;
  productId: string;
  titleSnapshot: string;
  image: string;
  quantity: number;
  unitPriceInr: number;
};

const globalForOrders = globalThis as unknown as {
  demoOrders?: DemoOrder[];
  mongoClientPromise?: Promise<MongoClient>;
};

function getDemoOrders() {
  globalForOrders.demoOrders ??= [];
  return globalForOrders.demoOrders;
}

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

async function getMongoClient() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  globalForOrders.mongoClientPromise ??= new MongoClient(databaseUrl).connect();
  return globalForOrders.mongoClientPromise;
}

async function getMongoDatabase() {
  const client = await getMongoClient();
  return client.db();
}

function toPersistentOrder(order: MongoOrderDocument, items: MongoOrderItemDocument[]): PersistentOrder {
  return {
    id: order._id.toString(),
    userId: order.userId.toString(),
    status: order.status,
    paymentStatus: order.paymentStatus,
    subtotalInr: order.subtotalInr,
    discountInr: order.discountInr,
    shippingInr: order.shippingInr,
    taxInr: order.taxInr,
    totalInr: order.totalInr,
    currency: order.currency,
    addressSnapshot: order.addressSnapshot,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    items: items.map((item) => ({
      id: item._id.toString(),
      orderId: item.orderId.toString(),
      productId: item.productId,
      titleSnapshot: item.titleSnapshot,
      image: item.image,
      quantity: item.quantity,
      unitPriceInr: item.unitPriceInr
    }))
  };
}

export async function resolveCheckoutUser(token: CheckoutToken): Promise<CheckoutUser | null> {
  const email = token.email?.trim().toLowerCase();
  if (!email) return null;

  const name = token.name?.trim() || (token.role === "ADMIN" ? "Demo Admin" : "Demo Customer");
  const role = token.role === "ADMIN" ? "ADMIN" : "CUSTOMER";

  if (!hasDatabaseUrl()) {
    return { id: `demo-${email}`, email, name, role };
  }

  const db = await getMongoDatabase();
  const users = db.collection<MongoUserDocument>("User");
  const now = new Date();
  const existingUser = await users.findOne({ email });

  if (existingUser) {
    await users.updateOne({ _id: existingUser._id }, { $set: { name, role, updatedAt: now } });
    return { id: existingUser._id.toString(), email: existingUser.email, name, role };
  }

  const createdUser = await users.insertOne({ _id: new ObjectId(), email, name, role, createdAt: now, updatedAt: now });
  return { id: createdUser.insertedId.toString(), email, name, role };
}

export async function createCheckoutOrder(params: {
  user: CheckoutUser;
  items: CartLine[];
  totals: OrderTotals;
  address: AddressInput;
}) {
  const products = await getProductsByIds(params.items.map((item) => item.productId));
  const itemSnapshots = params.items.map((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
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
      currency: "PKR",
      addressSnapshot: params.address,
      createdAt: new Date(),
      items: itemSnapshots.map((item, index) => ({ id: `${index}-${item.productId}`, ...item }))
    };
    getDemoOrders().unshift(order);
    return order;
  }

  const db = await getMongoDatabase();
  const orders = db.collection<MongoOrderDocument>("Order");
  const orderItems = db.collection<MongoOrderItemDocument>("OrderItem");
  const now = new Date();
  const orderId = new ObjectId();
  const userId = new ObjectId(params.user.id);
  const orderDocument: MongoOrderDocument = {
    _id: orderId,
    userId,
    status: "PENDING",
    paymentStatus: "UNPAID",
    subtotalInr: params.totals.subtotalInr,
    discountInr: params.totals.discountInr,
    shippingInr: params.totals.shippingInr,
    taxInr: params.totals.taxInr,
    totalInr: params.totals.totalInr,
    currency: "PKR",
    addressSnapshot: params.address,
    createdAt: now,
    updatedAt: now
  };
  const itemDocuments = itemSnapshots.map((item) => ({ _id: new ObjectId(), orderId, ...item }));

  await orders.insertOne(orderDocument);
  if (itemDocuments.length) {
    await orderItems.insertMany(itemDocuments);
  }

  return toPersistentOrder(orderDocument, itemDocuments);
}

export async function getOrdersForUser(user: CheckoutUser, orderId?: string | null): Promise<SerializedOrder[]> {
  if (!hasDatabaseUrl()) {
    return getDemoOrders()
      .filter((order) => order.userId === user.id && (!orderId || order.id === orderId))
      .map((order) => serializeOrder(order, user));
  }

  const db = await getMongoDatabase();
  const orders = db.collection<MongoOrderDocument>("Order");
  const orderItems = db.collection<MongoOrderItemDocument>("OrderItem");
  const userId = new ObjectId(user.id);
  const requestedOrderId = orderId && ObjectId.isValid(orderId) ? new ObjectId(orderId) : null;
  const orderDocuments = await orders
    .find({
      userId,
      ...(requestedOrderId ? { _id: requestedOrderId } : {})
    })
    .sort({ createdAt: -1 })
    .toArray();

  const orderObjectIds = orderDocuments.map((order) => order._id);
  const itemDocuments = orderObjectIds.length
    ? await orderItems.find({ orderId: { $in: orderObjectIds } }).toArray()
    : [];

  return orderDocuments.map((order) => {
    const items = itemDocuments.filter((item) => item.orderId.equals(order._id));
    return serializeOrder(toPersistentOrder(order, items), user);
  });
}

export function formatOrderNumber(orderId: string) {
  return `8X-${orderId.slice(-6).toUpperCase()}`;
}

export function serializeOrder(order: PersistentOrder | DemoOrder, user?: Pick<CheckoutUser, "email" | "name"> | null) {
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
