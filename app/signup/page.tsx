"use client";

import { signup } from "@/app/signup/actions";
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
import React, { useActionState, useTransition } from "react";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";
import { signUpSchema } from "./schema";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { signupDetailsStore } from "@/lib/store/signup-details-store";

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [pending, startTransition] = useTransition();
  const [state, formAction] = useActionState(signup, EMPTY_FORM_STATE);
  const setSignupDetails = signupDetailsStore((s) => s.setSignupDetails);

  const searchParams = useSearchParams();

  const callback = searchParams.get("callback");

  // Initialize the form
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      callback,
      acceptTerms: false,
    },
  });

  console.log("State", state);

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
              Create an Account
            </CardTitle>
            <CardDescription className="text-center">
              Sign up to save your assessment results and track your progress
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
                      // Save signup details to Zustand store before submitting
                      setSignupDetails({
                        name: form.getValues("name"),
                        email: form.getValues("email"),
                        password: form.getValues("password"),
                        acceptTerms: form.getValues("acceptTerms"),
                        callback: form.getValues("callback"),
                      });
                    } else {
                      e.preventDefault();
                    }
                  });
                  // if (form.formState.isValid) {

                  // } else {
                  //   e.preventDefault();
                  // }
                }}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your name"
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          id={field.name}
                          name={field.name}
                          value={field.value ? "on" : ""} // weird but for form purposes we need this
                          onBlur={field.onBlur}
                          checked={field.value}
                          onCheckedChange={(x) => {
                            console.log("checked", x);
                            console.log("field", field);
                            field.onChange(x);
                          }}
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

                <input type="hidden" {...form.register("callback")} />

                {noScriptFallback}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting || pending}
                >
                  {form.formState.isSubmitting || pending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
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
