"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { loginSchema } from "./login-schema";
import {
  FormState,
  fromErrorToFormState,
  toFormState,
} from "@/utils/to-form-state";

export async function login(
  _prevState: any, // why?
  formData: FormData
): Promise<FormState> {
  try {
    const supabase = await createClient();

    // Validate input using Zod
    console.log("Form Data", formData, Object.fromEntries(formData.entries()));
    const { email, password, callback } = loginSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
      callback: formData.get("callback"),
    });

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.code === "email_not_confirmed") {
        redirect("/login/verify-email?email=" + email);
      }
      console.log(
        "error on login",
        error,
        error.code,
        error.message,
        error.name
      );
      return toFormState("ERROR", error.message);
    }

    revalidatePath("/", "layout");
    redirect(callback || "/");

    return toFormState("SUCCESS", "Login successful!");
  } catch (error) {
    return fromErrorToFormState(error);
  }
}
