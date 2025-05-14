import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { redirect } from "next/navigation";
import VerifyEmailClient from "./verify-email-client";
import { AuthStepCard } from "@/components/molecules/auth-step-card";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ callback?: string }>;
}) {
  // Server-side: check user session and redirect if verified
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // Zustand store is not available server-side, so get callback from searchParams or cookies if needed
  const { callback } = await searchParams; // TODO: get from cookies or searchParams if needed
  if (user && user.email_confirmed_at) {
    redirect(callback || "/");
  }
  // Render the client component for the rest of the UI
  return (
    <AuthStepCard parentPage="/login" parentPageTitle="Login">
      <VerifyEmailClient />
    </AuthStepCard>
  );
}
