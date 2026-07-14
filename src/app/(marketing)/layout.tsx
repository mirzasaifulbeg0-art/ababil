import { auth } from "@/lib/auth";
import { getCartCount } from "@/lib/cart";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";

/**
 * Layout for all public marketing pages. Renders the real Navbar (with live
 * auth state + cart count) and Footer around the page content.
 */
export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, cartCount] = await Promise.all([auth(), getCartCount()]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar isAuthed={!!session?.user} cartCount={cartCount} />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
