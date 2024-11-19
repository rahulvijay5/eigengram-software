import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const NotAuthorised = () => {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <div>You are not allowed to view this page! Kindly go back</div>
      <div className="text-blue-500 mt-4 font-semibold">
        <Link href={"/"} className="flex gap-1">
          Go Back
          <ArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default NotAuthorised;
