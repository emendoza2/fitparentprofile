import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { signUpSchema } from "@/app/signup/schema";
import { createClient } from "@/utils/supabase/client";
import { toAbsoluteUrl } from "@/utils/callback";
import { toast } from "@/hooks/use-toast";

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Magic link signup (default)
  const signupWithMagicLink = async (
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
          shouldCreateUser: true,
        },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      toast({
        title: "Check your email",
        description: `A magic link has been sent to ${email}. Please check your inbox to complete signup.`,
      });
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Password signup (fallback)
  const signupWithPassword = async (values: z.infer<typeof signUpSchema>) => {
    setLoading(true);
    setError(null);
    try {
      signUpSchema.parse(values);
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.first_name,
            last_name: values.last_name,
          },
        },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      if (data?.user && !data.user.email_confirmed_at) {
        const redirectUrl = `/signup/verify-email$${
          values.callback
            ? `?callback=${encodeURIComponent(values.callback)}`
            : ""
        }`;
        router.push(redirectUrl);
        return;
      }
      router.push(values.callback || "/");
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Social signup
  const signupWithProvider = async (
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
    signupWithMagicLink,
    signupWithPassword,
    signupWithProvider,
    loading,
    error,
    setError,
  };
}
