"use client";

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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSignup } from "@/hooks/use-signup";
import { useRouter } from "next/navigation";

const changeEmailSchema = z.object({
  newEmail: z.string().email(),
});

export default function VerifyEmailClient() {
  const email = signupDetailsStore((s) => s.email);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const { signup, loading: signupLoading, error: signupError } = useSignup();
  const router = useRouter();

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

  const handleChangeEmail = async (values: { newEmail: string }) => {
    const { name, password, acceptTerms, callback } =
      signupDetailsStore.getState();
    if (!name || !password || !acceptTerms) {
      toast({
        title: "Missing details",
        description:
          "We couldn't find your previous signup details. Please restart the signup process.",
        variant: "destructive",
      });
      return;
    }
    await signup({
      name,
      email: values.newEmail,
      password,
      confirmPassword: password,
      acceptTerms: true,
      callback: callback || "",
    } as any);
    signupDetailsStore.getState().setSignupDetails({
      email: values.newEmail,
      callback,
      name,
      password,
      acceptTerms,
    });
  };

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
            onChangeEmail={handleChangeEmail}
            loading={signupLoading}
          />
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pt-2">
        {signupError && (
          <div className="text-red-500 text-center">{signupError}</div>
        )}
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
  onChangeEmail,
  loading,
}: {
  onChangeEmail: (values: { newEmail: string }) => void;
  loading: boolean;
}) {
  const changeEmailForm = useForm({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { newEmail: "" },
  });

  return (
    <div className="mt-4">
      <Form {...changeEmailForm}>
        <form
          onSubmit={changeEmailForm.handleSubmit(onChangeEmail)}
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
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
