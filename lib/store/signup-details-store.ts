import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface SignupDetailsState {
  name: string;
  password: string;
  email: string;
  acceptTerms: boolean;
  callback?: string | null;
  setSignupDetails: (details: {
    name: string;
    password: string;
    email: string;
    acceptTerms: boolean;
    callback?: string | null;
  }) => void;
  clearSignupDetails: () => void;
}

export const signupDetailsStore = create<SignupDetailsState>()(
  devtools(
    persist(
      (set) => ({
        name: "",
        password: "",
        email: "",
        acceptTerms: false,
        callback: null,
        setSignupDetails: ({ name, password, email, acceptTerms, callback }) =>
          set({
            name,
            password, // potential vulnerability here: password is stored in the clear
            email,
            acceptTerms,
            callback: callback ?? null,
          }),
        clearSignupDetails: () =>
          set({
            name: "",
            password: "",
            email: "",
            acceptTerms: false,
            callback: null,
          }),
      }),
      {
        name: "signup-details",
      }
    ),
    {
      name: "signup-details",
    }
  )
);
