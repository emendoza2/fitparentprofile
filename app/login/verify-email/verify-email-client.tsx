"use client";

import { Suspense, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { signupDetailsStore } from "@/lib/store/signup-details-store";

const changeEmailSchema = z.object({
  newEmail: z.string().email(),
});

function VerifyEmailClientInner() {
  const router = useRouter();
  const email = useSearchParams().get("email") || "";
  const [isResending, setIsResending] = useState(false);

  const changeEmailForm = useForm({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { newEmail: "" },
  });

  useEffect(() => {
    if (!email) {
      return router.push("/login");
    }
  }, []);

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
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pt-2">
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
        </div>
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

export default function VerifyEmailClient() {
  return (
    <Suspense>
      <VerifyEmailClientInner />
    </Suspense>
  );
}
