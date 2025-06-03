import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { loginSchema } from "@/app/login/login-schema";
import { createClient } from "@/utils/supabase/client";
import { toAbsoluteUrl } from "@/utils/callback";
import { toast } from "@/hooks/use-toast";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Magic link login (default)
  const loginWithMagicLink = async (
    email: string,
    callback?: string | null
  ) => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: toAbsoluteUrl(callback),
        },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      // Show a toast to check email
      toast({
        title: "Check your email",
        description: `A magic link has been sent to ${email}. Please check your inbox to log in.`,
      });
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Password login (fallback)
  const loginWithPassword = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    setError(null);
    try {
      loginSchema.parse(values);
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) {
        if (error.code === "email_not_confirmed") {
          router.push(
            `/login/verify-email?email=${encodeURIComponent(values.email)}`
          );
          return;
        }
        setError(error.message);
        setLoading(false);
        return;
      }
      router.push(values.callback || "/");
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Social login
  const loginWithProvider = async (
    provider: "google" | "facebook" | "apple",
    callback?: string | null
  ) => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: toAbsoluteUrl(callback),
        },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return {
    loginWithMagicLink,
    loginWithPassword,
    loginWithProvider,
    loading,
    error,
    setError,
  };
}
