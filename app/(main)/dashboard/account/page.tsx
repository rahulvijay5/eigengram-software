import AccountPage from "@/components/AccountsPage";
import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const Accounts = async () => {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  const dbUser = await db.user.findUnique({
    where: { externalId: user.id },
  });

  return (
    <div>
      <AccountPage user={dbUser!} />
    </div>
  );
};

export default Accounts;
