"use client";

import { useActionState, useEffect, useTransition } from "react";
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
import { login } from "./actions";
import { loginSchema } from "./login-schema";
import { EMPTY_FORM_STATE } from "@/utils/to-form-state";
import { useToastMessage } from "@/hooks/use-toast-message";
import { ShowHidePasswordInput } from "@/components/molecules/show-hide-password-input";
import { useFormStatus } from "react-dom";
import { signupDetailsStore } from "@/lib/store/signup-details-store";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [state, formAction] = useActionState(login, EMPTY_FORM_STATE);

  // const { pending } = useFormStatus();
  const searchParams = useSearchParams();
  const callback = searchParams.get("callback");

  const [pending, startTransition] = useTransition();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      callback,
    },
  });
  console.log(
    "pending",
    pending,
    form.formState.isLoading,
    form.formState.isSubmitting
  );

  const noScriptFallback = useToastMessage(state);

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
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center">
              Log in to access your assessment results and track your progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                action={formAction}
                onSubmit={(e) => {
                  form.trigger().then((isValid) => {
                    if (isValid) {
                      startTransition(() => {
                        (e.target as HTMLFormElement).requestSubmit();
                      });
                      signupDetailsStore.getState().clearSignupDetails();
                    } else {
                      e.preventDefault();
                    }
                  });
                }}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
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
                  control={form.control}
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

                <input type="hidden" {...form.register("callback")} />

                {noScriptFallback}

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
                  disabled={pending || form.formState.isSubmitting}
                >
                  {pending || form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Log In"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/signup"
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
