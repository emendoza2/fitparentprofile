"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToastMessage } from "@/hooks/use-toast-message";
import { EMPTY_FORM_STATE } from "@/utils/to-form-state";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { Suspense, useTransition } from "react";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";
import { signUpSchema } from "./schema";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { signupDetailsStore } from "@/lib/store/signup-details-store";
import { useSignup } from "@/hooks/use-signup";
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";

type SignUpFormValues = z.infer<typeof signUpSchema>;

function SocialSignupButtons({
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
        Sign up with Google
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => onProvider("facebook")}
        disabled={loading}
      >
        <FaFacebook className="h-5 w-5 mr-2" />
        Sign up with Facebook
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => onProvider("apple")}
        disabled={loading}
      >
        <FaApple className="h-5 w-5 mr-2" />
        Sign up with Apple
      </Button>
    </div>
  );
}

function SignUpPageInner() {
  const {
    signupWithMagicLink,
    signupWithPassword,
    signupWithProvider,
    loading,
    error,
    setError,
  } = useSignup();
  const setSignupDetails = signupDetailsStore((s) => s.setSignupDetails);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const callback = searchParams.get("callback");

  // Magic link form
  const magicForm = useForm<{ email: string }>({
    defaultValues: { email: "" },
  });

  // Password form
  const passwordForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      callback,
      acceptTerms: false,
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
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
              Create an Account
            </CardTitle>
            <CardDescription className="text-center">
              Your FIT Parent account saves your assessment results and tracks
              your progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SocialSignupButtons
              onProvider={(provider) => signupWithProvider(provider, callback)}
              loading={loading}
            />
            <div className="relative flex items-center my-4">
              <div className="flex-grow border-t border-gray-200 dark:border-gray-700" />
              <span className="mx-2 text-xs text-gray-400">or</span>
              <div className="flex-grow border-t border-gray-200 dark:border-gray-700" />
            </div>
            {!showPassword ? (
              <Form {...magicForm}>
                <form
                  onSubmit={magicForm.handleSubmit(async ({ email }) => {
                    setError(null);
                    await signupWithMagicLink(email, callback);
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
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(async (values) => {
                    setError(null);
                    setSignupDetails({
                      first_name: values.first_name,
                      last_name: values.last_name,
                      email: values.email,
                      password: values.password,
                      acceptTerms: values.acceptTerms,
                      callback: values.callback,
                    });
                    await signupWithPassword(values);
                  })}
                  className="space-y-6"
                >
                  <FormField
                    control={passwordForm.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your first name"
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
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your last name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                            placeholder="Create a password"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Must be at least 10 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            id={field.name}
                            name={field.name}
                            value={field.value ? "on" : ""}
                            onBlur={field.onBlur}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I accept the{" "}
                            <Link
                              href="/terms"
                              className="text-blue-600 hover:underline"
                            >
                              terms of service
                            </Link>{" "}
                            and{" "}
                            <Link
                              href="/privacy"
                              className="text-blue-600 hover:underline"
                            >
                              privacy policy
                            </Link>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <input type="hidden" {...passwordForm.register("callback")} />
                  {error && (
                    <div className="text-red-600 text-sm text-center">
                      {error}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || passwordForm.formState.isSubmitting}
                  >
                    {loading || passwordForm.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing up...
                      </>
                    ) : (
                      "Sign Up"
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
              Already have an account?{" "}
              <Link
                href={
                  callback
                    ? `/login?callback=${encodeURIComponent(callback)}`
                    : "/login"
                }
                className="text-blue-600 hover:underline font-medium"
              >
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpPageInner />
    </Suspense>
  );
}

interface ShowHidePasswordInputProps {
  field: React.ComponentProps<"input">;
}
export const ShowHidePasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="Create a password"
        ref={ref}
        {...props}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="size-4" />
        ) : (
          <Eye className="size-4" />
        )}
      </button>
    </div>
  );
});
