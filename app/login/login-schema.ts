import { z } from "zod";
// Define the form validation schema
export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  callback: z.preprocess((val) => val || null, z.string().nullable()),
});
