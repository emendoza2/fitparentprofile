import { useRef, useEffect } from "react";
import { FormState } from "@/utils/to-form-state";
import { toast } from "./use-toast";

const useToastMessage = (formState: FormState) => {
  const prevTimestamp = useRef(formState.timestamp);

  const showToast =
    formState.message && formState.timestamp !== prevTimestamp.current;

  useEffect(() => {
    if (showToast) {
      if (formState.status === "ERROR") {
        toast({
          title: "Error",
          description: formState.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: formState.message,
        });
      }

      prevTimestamp.current = formState.timestamp;
    }
  }, [formState, showToast]);

  return (
    <noscript>
      {formState.status === "ERROR" && (
        <div style={{ color: "red" }}>{formState.message}</div>
      )}

      {formState.status === "SUCCESS" && (
        <div style={{ color: "green" }}>{formState.message}</div>
      )}
    </noscript>
  );
};

export { useToastMessage };
