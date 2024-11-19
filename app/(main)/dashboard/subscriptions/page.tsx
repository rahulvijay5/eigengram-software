import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function SubscribedServices({
  userId,
}: {
  userId: string;
}) {
  const subscriptions = await db.subscription.findMany({
    where: {
      userId,
      status: "ACTIVE",
    },
    include: {
      service: true,
    },
  });

  if (subscriptions.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No active subscriptions found.
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/admin">
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold mb-6">My Subscriptions</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subscriptions.map(
          ({
            service,
          }: {
            service: { id: string; name: string; description: string };
          }) => (
            <Card
              key={service.id}
              className="hover:shadow dark:hover:shadow-white/20 hover:shadow-black/40"
            >
              <Link href={`/services/${service.id}`}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{service.name}</CardTitle>
                  </div>
                  <ArrowUpRight />
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3">{service.description}</p>
                </CardContent>
              </Link>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
