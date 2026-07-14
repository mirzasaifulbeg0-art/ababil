"use server";

import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";

export type ActionResult = { ok: boolean; error?: string };

/** Store a contact-form submission for the admin to read. */
export async function submitContact(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, email, phone, subject, message } = parsed.data;
  await prisma.contactMessage.create({
    data: {
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
    },
  });

  return { ok: true };
}
