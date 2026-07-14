import type { Metadata } from "next";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import { SITE } from "@/lib/constants";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardBody } from "@/components/ui/card";
import { ContactForm } from "@/components/shared/contact-form";

export const metadata: Metadata = {
  title: "Contact ABABIL",
  description:
    "Get in touch with the ABABIL team. Reach us by email, phone or WhatsApp, or send us a message using the contact form.",
};

export default function ContactPage() {
  const whatsappHref = SITE.whatsapp
    ? `https://wa.me/${SITE.whatsapp.replace(/[^\d]/g, "")}`
    : null;

  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Contact"
          title="We&apos;d love to hear from you"
          subtitle="Questions about a service, product or your order? Send us a message and we&apos;ll respond as soon as we can."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          {/* Left: contact info */}
          <div className="lg:col-span-2">
            <h2 className="font-heading text-xl font-semibold text-brand-navy-800">
              Get in touch
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Prefer to reach out directly? Use any of the channels below.
            </p>

            <div className="mt-6 space-y-4">
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-card transition-colors hover:border-brand-green-200"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-green-50 text-brand-green-600">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-brand-navy-800">
                    Email
                  </div>
                  <div className="text-sm text-slate-600">{SITE.email}</div>
                </div>
              </a>

              {SITE.phone && (
                <a
                  href={`tel:${SITE.phone.replace(/\s+/g, "")}`}
                  className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-card transition-colors hover:border-brand-green-200"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-green-50 text-brand-green-600">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-brand-navy-800">
                      Phone
                    </div>
                    <div className="text-sm text-slate-600">{SITE.phone}</div>
                  </div>
                </a>
              )}

              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-card transition-colors hover:border-brand-green-200"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-green-50 text-brand-green-600">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-brand-navy-800">
                      WhatsApp
                    </div>
                    <div className="text-sm text-slate-600">
                      Chat with us on WhatsApp
                    </div>
                  </div>
                </a>
              )}

              <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-green-50 text-brand-green-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-brand-navy-800">
                    Support hours
                  </div>
                  <div className="text-sm text-slate-600">
                    Mon–Sat, 10:00 AM – 7:00 PM
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: contact form */}
          <div className="lg:col-span-3">
            <Card>
              <CardBody>
                <h2 className="font-heading text-xl font-semibold text-brand-navy-800">
                  Send us a message
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Fill out the form and we&apos;ll get back to you shortly.
                </p>
                <div className="mt-5">
                  <ContactForm />
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
