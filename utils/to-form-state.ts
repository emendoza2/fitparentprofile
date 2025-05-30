import { ZodError } from "zod";

export type FormState = {
  status: "UNSET" | "SUCCESS" | "ERROR";
  message: string;
  fieldErrors: Record<string, string[] | undefined>;
  timestamp: number;
};

export const EMPTY_FORM_STATE: FormState = {
  status: "UNSET" as const,
  message: "",
  fieldErrors: {},
  timestamp: Date.now(),
};

export function fromErrorToFormState(error: unknown) {
  if (error instanceof ZodError) {
    return {
      status: "ERROR" as const,
      message: "",
      fieldErrors: error.flatten().fieldErrors,
      timestamp: Date.now(),
    };
  } else if (error instanceof Error) {
    if (error.message.startsWith("NEXT_")) {
      throw error; // just forward errors that belong to nextjs
    }
    return {
      status: "ERROR" as const,
      message: error.message,
      fieldErrors: {},
      timestamp: Date.now(),
    };
  } else {
    return {
      status: "ERROR" as const,
      message: "An unknown error occurred",
      fieldErrors: {},
      timestamp: Date.now(),
    };
  }
}

export function toFormState(
  status: FormState["status"],
  message: string
): FormState {
  return {
    status,
    message,
    fieldErrors: {},
    timestamp: Date.now(),
  };
}
