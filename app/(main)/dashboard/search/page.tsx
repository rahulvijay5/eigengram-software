import { Suspense } from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SearchServices } from "@/components/search-services";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function SearchServicesPage() {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  const dbUser = await db.user.findUnique({
    where: { externalId: user.id },
  });

  if (!dbUser) {
    redirect("/onboarding");
  }

  const services = await db.service.findMany({
    where: {
      isActive: true,
      subscriptions: {
        none: {
          userId: dbUser.id,
        },
      },
    },
  });

  // Convert Decimal to string for serialization
  const serializableServices = services.map((service) => ({
    ...service,
    price: service.price.toString(),
  }));

  return (
    <div className="flex h-screen">
      {" "}
      <main className="flex-1 overflow-y-auto">
        <div className="flex gap-2">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/admin">
              <ArrowLeft className="h-6 w-6" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Search Services</h1>
        </div>
        <Suspense fallback={<div>Loading services...</div>}>
          <SearchServices
            initialServices={serializableServices}
            userId={dbUser.id}
          />
        </Suspense>
      </main>
    </div>
  );
}
