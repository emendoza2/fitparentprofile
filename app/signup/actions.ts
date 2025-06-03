import { z } from "zod";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import {
  FormState,
  fromErrorToFormState,
  toFormState,
} from "@/utils/to-form-state";
import { signUpSchema } from "./schema";

// Define the user schema
const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

type UserData = z.infer<typeof userSchema>;

/**
 * Create a new user
 *
 * This is a placeholder implementation. In a real application, you would:
 * 1. Hash the password
 * 2. Store the user in a database
 * 3. Create a session or JWT token
 * 4. Handle email verification
 */
export async function createUser(userData: UserData) {
  // Validate the user data
  const validatedData = userSchema.parse(userData);

  // Simulate a delay to mimic a real API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In a real application, you would store the user in a database
  console.log("Creating user:", {
    name: validatedData.name,
    email: validatedData.email,
    // Password would be hashed in a real application
  });

  // Return the created user (without the password)
  return {
    name: validatedData.name,
    email: validatedData.email,
  };
}

export async function signup(
  _prevState: any,
  formData: FormData
): Promise<FormState> {
  try {
    const supabase = await createClient();

    // Validate input using Zod
    console.log("Form Data", formData, Object.fromEntries(formData.entries()));
    const { name, email, password, callback } = signUpSchema.parse(
      Object.fromEntries(formData.entries())
    );

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return toFormState("ERROR", error.message);
    }

    revalidatePath("/", "layout");

    console.log("data user ", data?.user);

    // Check if the user needs to verify their email
    if (data?.user && !data.user.email_confirmed_at) {
      // Redirect to verify-email page with callback preserved
      const redirectUrl = `/signup/verify-email${
        callback ? `?callback=${encodeURIComponent(callback)}` : ""
      }`;
      redirect(redirectUrl);
    }

    if (callback) {
      redirect(callback);
    } else {
      redirect("/");
    }
    return toFormState("SUCCESS", "Signup successful!");
  } catch (error) {
    console.log("Error", error);
    console.error("Signup error:", error);
    return fromErrorToFormState(error);
  }
}
