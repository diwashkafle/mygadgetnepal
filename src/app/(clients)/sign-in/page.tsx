"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { Suspense } from "react";

function SignInContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 bg-white border p-6 rounded shadow">
        <h1 className="text-xl font-semibold text-center">Sign In</h1>

        {error && (
          <p className="text-sm text-red-500 text-center">
            Login failed. Please try again.
          </p>
        )}

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white border rounded shadow hover:bg-gray-50 transition"
        >
          <FcGoogle className="text-xl" />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-sm space-y-6 bg-white border p-6 rounded shadow">
          <h1 className="text-xl font-semibold text-center">Sign In</h1>
          <div className="text-center">Loading...</div>
        </div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
