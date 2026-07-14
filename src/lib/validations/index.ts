import { z } from "zod";

/** Reusable field pieces. */
const email = z.string().trim().toLowerCase().email("Enter a valid email");
const password = z.string().min(8, "Password must be at least 8 characters");
const phone = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number")
  .max(20);

// --- Auth --------------------------------------------------------------------
export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your name"),
    email,
    password,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password"),
});
export type LoginInput = z.infer<typeof loginSchema>;

// --- Contact -----------------------------------------------------------------
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email,
  phone: phone.optional().or(z.literal("")),
  subject: z.string().trim().max(150).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});
export type ContactInput = z.infer<typeof contactSchema>;

// --- Digital service request -------------------------------------------------
export const serviceRequestSchema = z.object({
  serviceId: z.string().min(1),
  fullName: z.string().trim().min(2, "Please enter your full name"),
  phone,
  email: email.optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});
export type ServiceRequestInput = z.infer<typeof serviceRequestSchema>;

// --- Checkout ----------------------------------------------------------------
export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Enter your name"),
  customerEmail: email,
  customerPhone: phone,
  addressLine1: z.string().trim().min(3, "Enter your address"),
  addressLine2: z.string().trim().optional().or(z.literal("")),
  city: z.string().trim().min(2, "Enter your city"),
  state: z.string().trim().min(2, "Enter your state"),
  postalCode: z.string().trim().min(4, "Enter a valid postal code"),
  paymentMethod: z.enum(["COD", "UPI", "RAZORPAY"]).default("COD"),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;

// --- Review ------------------------------------------------------------------
export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(3, "Please write a short comment").max(1000),
});
export type ReviewInput = z.infer<typeof reviewSchema>;

// --- Profile -----------------------------------------------------------------
export const profileSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  phone: phone.optional().or(z.literal("")),
});
export type ProfileInput = z.infer<typeof profileSchema>;
