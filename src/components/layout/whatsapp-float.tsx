import { MessageCircle } from "lucide-react";
import { SITE } from "@/lib/constants";

/** Floating WhatsApp button — only rendered when a number is configured. */
export function WhatsAppFloat() {
  if (!SITE.whatsapp) return null;
  return (
    <a
      href={`https://wa.me/${SITE.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
