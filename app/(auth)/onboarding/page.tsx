import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { OnboardingForm } from "@/components/auth/OnboardingForm";

export default async function Onboarding() {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    redirect("/api/auth/login");
  }

  // Check if the user already exists in the database
  const existingUser = await db.user.findUnique({
    where: { externalId: user.id },
  });

  if (existingUser) {
    redirect("/dashboard");
  }

  return (
    <div className="container max-w-4xl min-h-screen flex items-center justify-between mx-auto py-10">
      <h1 className="font-bold mb-6 w-1/2">
        <div className="text-3xl font-extrabold font-serif">
          Welcome {user.given_name}!
        </div>
        <div className="text-xl mt-2 font-bold ">
          Let&apos;s complete your profile...
        </div>
      </h1>
      <OnboardingForm user={user} />
    </div>
  );
}
