import { z } from "zod";

// Define the form validation schema

export const signUpSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(10, { message: "Password must be at least 10 characters" }),
    // .regex(/[A-Z]/, {
    //   message: "Password must contain at least one uppercase letter",
    // })
    // .regex(/[a-z]/, {
    //   message: "Password must contain at least one lowercase letter",
    // })
    // .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
    acceptTerms: z.coerce.boolean().refine((val) => val === true, {
      message: "You must accept the terms and privacy policy",
    }),
    callback: z.string().nullable(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
