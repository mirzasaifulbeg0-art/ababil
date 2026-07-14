import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Razorpay webhook (TEST MODE READY).
 *
 * When real keys are added, Razorpay POSTs payment events here. We verify the
 * signature with RAZORPAY_KEY_SECRET, then flip the matching order to PAID.
 * Until keys exist this endpoint safely no-ops with a 200 so setup is easy.
 */
export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const signature = request.headers.get("x-razorpay-signature");
  const raw = await request.text();

  // No keys configured yet — acknowledge without processing.
  if (!secret) {
    return NextResponse.json({ received: true, mode: "test-no-keys" });
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(raw)
    .digest("hex");

  if (!signature || signature !== expected) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: {
    event?: string;
    payload?: { payment?: { entity?: { order_id?: string; id?: string } } };
  };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event === "payment.captured") {
    const payment = event.payload?.payment?.entity;
    const gatewayOrderId = payment?.order_id;
    if (gatewayOrderId) {
      await prisma.order.updateMany({
        where: { paymentId: gatewayOrderId },
        data: { paymentStatus: "PAID", status: "PROCESSING" },
      });
    }
  }

  return NextResponse.json({ received: true });
}
