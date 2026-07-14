"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { serviceRequestSchema } from "@/lib/validations";

export type ActionResult = { ok: boolean; error?: string };

/** Submit an application-assistance request for a digital service. */
export async function submitServiceRequest(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const parsed = serviceRequestSchema.safeParse({
    serviceId: formData.get("serviceId"),
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    notes: formData.get("notes"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { serviceId, fullName, phone, email, notes } = parsed.data;

  const service = await prisma.digitalService.findFirst({
    where: { id: serviceId, isActive: true },
    select: { id: true },
  });
  if (!service) return { ok: false, error: "Service not found." };

  const session = await auth();

  await prisma.serviceRequest.create({
    data: {
      serviceId,
      userId: session?.user?.id ?? null,
      fullName,
      phone,
      email: email || null,
      notes: notes || null,
    },
  });

  return { ok: true };
}
