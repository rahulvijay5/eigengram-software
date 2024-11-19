import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { allowedMails } from "@/lib/constants";
import { UserList } from "../../_components/user-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminUsers() {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user || !allowedMails.includes(user.email!)) {
    redirect("/");
  }

  const users = await db.user.findMany({
    include: {
      _count: {
        select: { subscriptions: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto">
      <div className="flex gap-2 items-center mb-6">
        <Button asChild variant="ghost">
          <Link href="/admin">
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Users</h1>
      </div>
      <p className="mb-4 text-muted-foreground">Total Users: <span className="font-bold">{users.length}</span></p>
      <UserList users={users} />
    </div>
  );
}
