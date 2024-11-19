import Link from "next/link";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { ModeToggle } from "@/components/ModeToggle";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Home() {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-gray-800 dark:text-gray-200 p-5 relative"><div className="absolute top-6 right-10"><ModeToggle /></div>
      <div className="w-full max-w-md p-6 bg-white dark:bg-slate-900 dark:shadow-white/50 rounded-lg shadow-md text-center space-y-4">
        {user && user.email ? (
          <>
            <h1 className="text-2xl font-semibold">
              Welcome, {user.given_name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              You are logged in to <span className="font-bold">EigenGram</span>.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-all"
              >
                Dashboard
              </Link>
              <LogoutLink className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-all">
                Logout
              </LogoutLink>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold">Welcome to EigenGram</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Please sign in to continue or create a new account.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <LoginLink className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-all">
                Sign In
              </LoginLink>
              <RegisterLink className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-all">
                Sign Up
              </RegisterLink>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
