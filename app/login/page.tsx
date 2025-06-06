"use client";

import { Suspense, useEffect, useTransition, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useLogin } from "@/hooks/use-login";
import { loginSchema } from "./login-schema";
import { EMPTY_FORM_STATE } from "@/utils/to-form-state";
import { useToastMessage } from "@/hooks/use-toast-message";
import { ShowHidePasswordInput } from "@/components/molecules/show-hide-password-input";
import { signupDetailsStore } from "@/lib/store/signup-details-store";
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";

type LoginFormValues = z.infer<typeof loginSchema>;

function SocialLoginButtons({
  onProvider,
  loading,
}: {
  onProvider: (provider: "google" | "facebook" | "apple") => void;
  loading: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => onProvider("google")}
        disabled={loading}
      >
        <FaGoogle className="h-5 w-5 mr-2" />
        Continue with Google
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => onProvider("facebook")}
        disabled={loading}
      >
        <FaFacebook className="h-5 w-5 mr-2" />
        Continue with Facebook
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => onProvider("apple")}
        disabled={loading}
      >
        <FaApple className="h-5 w-5 mr-2" />
        Continue with Apple
      </Button>
    </div>
  );
}

function LoginPageInner() {
  const {
    loginWithMagicLink,
    loginWithPassword,
    loginWithProvider,
    loading,
    error,
    setError,
  } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const callback = searchParams.get("callback");

  // Magic link form
  const magicForm = useForm<{ email: string }>({
    defaultValues: { email: "" },
  });

  // Password form
  const passwordForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      callback,
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center">
              Log in to access your assessment results and track your progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SocialLoginButtons
              onProvider={(provider) => loginWithProvider(provider, callback)}
              loading={loading}
            />
            <div className="relative flex items-center my-4">
              <div className="flex-grow border-t border-gray-200 dark:border-gray-700" />
              <span className="mx-2 text-xs text-gray-400">or</span>
              <div className="flex-grow border-t border-gray-200 dark:border-gray-700" />
            </div>
            {!showPassword ? (
              <Form key="magic-form" {...magicForm}>
                <form
                  onSubmit={magicForm.handleSubmit(async ({ email }) => {
                    setError(null);
                    await loginWithMagicLink(email, callback);
                  })}
                  className="space-y-6"
                >
                  <FormField
                    control={magicForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            autoFocus
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {error && (
                    <div className="text-red-600 text-sm text-center">
                      {error}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || magicForm.formState.isSubmitting}
                  >
                    {loading || magicForm.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending magic link...
                      </>
                    ) : (
                      "Send Magic Link"
                    )}
                  </Button>
                  <div className="flex justify-center">
                    <button
                      type="button"
                      className="text-xs text-blue-600 hover:underline mt-2"
                      onClick={() => setShowPassword(true)}
                    >
                      Use password instead
                    </button>
                  </div>
                </form>
              </Form>
            ) : (
              <Form key="password-form" {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(async (values) => {
                    setError(null);
                    await loginWithPassword(values);
                    signupDetailsStore.getState().clearSignupDetails();
                  })}
                  className="space-y-6"
                >
                  <FormField
                    control={passwordForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            autoFocus
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <ShowHidePasswordInput
                            placeholder="Enter your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <input type="hidden" {...passwordForm.register("callback")} />
                  {error && (
                    <div className="text-red-600 text-sm text-center">
                      {error}
                    </div>
                  )}
                  <div className="flex justify-end">
                    <Link
                      href="/forgot-password"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || passwordForm.formState.isSubmitting}
                  >
                    {loading || passwordForm.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Log In"
                    )}
                  </Button>
                  <div className="flex justify-center">
                    <button
                      type="button"
                      className="text-xs text-blue-600 hover:underline mt-2"
                      onClick={() => setShowPassword(false)}
                    >
                      Use magic link instead
                    </button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href={
                  callback
                    ? `/signup?callback=${encodeURIComponent(callback)}`
                    : "/signup"
                }
                className="text-blue-600 hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  );
}
