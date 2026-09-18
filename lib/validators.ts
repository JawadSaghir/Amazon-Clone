import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export const cartLineSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(10)
});

export const checkoutSchema = z.object({
  items: z.array(cartLineSchema).min(1),
  couponCode: z.string().optional(),
  address: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(7),
    line1: z.string().min(4),
    line2: z.string().optional(),
    city: z.string().min(2),
    region: z.string().min(2),
    postalCode: z.string().min(4),
    country: z.enum(["India", "Pakistan"])
  })
});

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(80),
  body: z.string().min(10).max(1000)
});
