"use client";

import { signup } from "@/app/signup/actions";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useToastMessage } from "@/hooks/use-toast-message";
import { signupDetailsStore } from "@/lib/store/signup-details-store";
import { createClient } from "@/utils/supabase/client";
import { EMPTY_FORM_STATE } from "@/utils/to-form-state";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import { useActionState, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const changeEmailSchema = z.object({
  newEmail: z.string().email(),
});

export default function VerifyEmailClient() {
  const email = signupDetailsStore((s) => s.email);
  const [signupState, signupFormAction] = useActionState(
    signup,
    EMPTY_FORM_STATE
  );
  const [pendingSignup, startSignupTransition] = useTransition();

  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  const changeEmailForm = useForm({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { newEmail: "" },
  });

  useEffect(() => {
    console.log("email", email);
    if (!email) {
      // return router.push("/signup");
    }
  }, [email]);

  const handleResend = async () => {
    setIsResending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });
    setIsResending(false);
    if (error) {
      toast({
        title: "Resend failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Verification link resent!",
        description: "Check your email for the new link.",
      });
    }
  };

  // The way we're doing it here, progressive enhancement is not happening
  const handleChangeEmail = (values: { newEmail: string }) => {
    setIsChanging(true);
    // Get other signup details from Zustand store
    const { name, password, acceptTerms, callback } =
      signupDetailsStore.getState();
    if (!name || !password || !acceptTerms) {
      toast({
        title: "Missing details",
        description:
          "We couldn't find your previous signup details. Please restart the signup process.",
        variant: "destructive",
      });
      setIsChanging(false);
      return;
    }
    // Call the signup action with the new email and other details
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", values.newEmail);
      formData.append("password", password);
      formData.append("confirmPassword", password);
      formData.append("acceptTerms", "true");
      formData.append("callback", callback || "");
      // Use fetch to POST to the signup endpoint
      startSignupTransition(async () => {
        await signupFormAction(formData);
      });
      signupDetailsStore.getState().setSignupDetails({
        email: values.newEmail,
        callback,
        name,
        password,
        acceptTerms,
      });
    } catch (error) {
      toast({
        title: "Change email failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
    setIsChanging(false);
  };

  const noScriptFallback = useToastMessage(signupState);

  return (
    <>
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">
          Verify Your Email
        </CardTitle>
        <CardDescription className="text-center">
          We have sent a verification link to{" "}
          <span className="font-semibold">{email}</span>.<br />
          Please check your inbox and click the link to verify your email
          address.
          <br />
          If you didn't receive it, you can resend or change your email.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
          <h3 className="font-medium mb-2">Next steps:</h3>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
            <li>Check your email inbox for the verification link</li>
            <li>Click the link in the email to verify your account</li>
            <li>If you don't see the email, check your spam folder</li>
            <li>Feel free to close this tab when you're done</li>
          </ol>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Resending...
              </>
            ) : (
              "Resend Link"
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setShowChangeEmail((v) => !v)}
          >
            Change Email
          </Button>
        </div>

        {showChangeEmail && (
          <ChangeEmailForm
            signupState={signupState}
            signupFormAction={signupFormAction}
          />
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pt-2">
        {noScriptFallback}
        <div className="text-center text-sm text-muted-foreground">
          Need help?{" "}
          <a
            href="/support"
            className="text-primary hover:underline font-medium"
          >
            Contact Support
          </a>
        </div>
      </CardFooter>
    </>
  );
}

function ChangeEmailForm({
  signupFormAction,
}: {
  signupState: any;
  signupFormAction: (payload: FormData) => void;
}) {
  const email = signupDetailsStore((s) => s.email);
  const [pendingSignup, startSignupTransition] = useTransition();

  const [isChanging, setIsChanging] = useState(false);

  const changeEmailForm = useForm({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { newEmail: "" },
  });

  useEffect(() => {
    console.log("email", email);
    if (!email) {
      // return router.push("/signup");
    }
  }, [email]);

  // The way we're doing it here, progressive enhancement is not happening
  const handleChangeEmail = (values: { newEmail: string }) => {
    setIsChanging(true);
    // Get other signup details from Zustand store
    const { name, password, acceptTerms, callback } =
      signupDetailsStore.getState();
    if (!name || !password || !acceptTerms) {
      toast({
        title: "Missing details",
        description:
          "We couldn't find your previous signup details. Please restart the signup process.",
        variant: "destructive",
      });
      setIsChanging(false);
      return;
    }
    // Call the signup action with the new email and other details
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", values.newEmail);
      formData.append("password", password);
      formData.append("confirmPassword", password);
      formData.append("acceptTerms", "true");
      formData.append("callback", callback || "");
      // Use fetch to POST to the signup endpoint
      startSignupTransition(async () => {
        await signupFormAction(formData);
      });
      signupDetailsStore.getState().setSignupDetails({
        email: values.newEmail,
        callback,
        name,
        password,
        acceptTerms,
      });
    } catch (error) {
      toast({
        title: "Change email failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
    setIsChanging(false);
  };

  return (
    <div className="mt-4">
      <Form {...changeEmailForm}>
        <form
          onSubmit={changeEmailForm.handleSubmit(handleChangeEmail)}
          className="space-y-4"
          autoComplete="off"
        >
          <FormField
            control={changeEmailForm.control}
            name="newEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="new@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isChanging || pendingSignup}
          >
            {isChanging || pendingSignup ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Sending...
              </>
            ) : (
              "Send Link to New Email"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
