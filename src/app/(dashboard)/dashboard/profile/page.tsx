import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/dashboard/profile-form";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your ABABIL account details.",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, phone: true },
  });

  if (!user) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-navy-800">
          Profile
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Update your personal details.
        </p>
      </div>

      <Card className="max-w-xl">
        <CardBody>
          <CardTitle className="mb-4">Account details</CardTitle>
          <ProfileForm
            defaultName={user.name ?? ""}
            defaultPhone={user.phone ?? ""}
            email={user.email}
          />
        </CardBody>
      </Card>
    </div>
  );
}
