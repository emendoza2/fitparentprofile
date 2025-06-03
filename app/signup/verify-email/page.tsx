"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/context";
import VerifyEmailClient from "./verify-email-client";
import { AuthStepCard } from "@/components/molecules/auth-step-card";

function VerifyEmailPageInner() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callback = searchParams.get("callback");

  useEffect(() => {
    if (user && user.email_confirmed_at) {
      router.replace(callback || "/login");
    }
  }, [user, callback, router]);

  return (
    <AuthStepCard parentPage="/signup" parentPageTitle="Signup">
      <VerifyEmailClient />
    </AuthStepCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailPageInner />
    </Suspense>
  );
}
