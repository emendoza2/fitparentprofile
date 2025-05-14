// Provider wrapper
import {
  createPersonalityTestStore,
  PersonalityTestProps,
  PersonalityTestState,
  PersonalityTestStore,
} from "@/lib/store/personality-test-store";
import { useRef } from "react";

import { createContext } from "react";

import { useContext } from "react";
import { useStore } from "zustand";

export const PersonalityTestContext =
  createContext<PersonalityTestStore | null>(null);

type PersonalityTestProviderProps =
  React.PropsWithChildren<PersonalityTestProps>;

export function PersonalityTestProvider({
  children,
  ...props
}: PersonalityTestProviderProps) {
  const storeRef = useRef<PersonalityTestStore>(
    createPersonalityTestStore(props)
  );
  //   if (!storeRef.current) {
  //     storeRef.current = createPersonalityTestStore(props);
  //   }
  return (
    <PersonalityTestContext.Provider value={storeRef.current}>
      {children}
    </PersonalityTestContext.Provider>
  );
}

export function usePersonalityTestContext<T = PersonalityTestState>(
  selector: (state: PersonalityTestState) => T = (state) => state as T
): T {
  const store = useContext(PersonalityTestContext);
  if (!store)
    throw new Error("Missing PersonalityTestContext.Provider in the tree");
  return useStore(store, selector);
}

export function withPersonalityTestProvider<T extends PersonalityTestProps>(
  Component: React.ComponentType<T>
): React.ComponentType<T> {
  return function WithPersonalityTestProvider(props: T) {
    return (
      <PersonalityTestProvider {...props}>
        <Component {...props} />
      </PersonalityTestProvider>
    );
  };
}

// Computed values need to be computed in selectors like so:
export const useCurrentPageQuestions = () =>
  usePersonalityTestContext((state) => state.getCurrentPageQuestions());

export const usePageProgress = () =>
  usePersonalityTestContext((state) => state.getPageProgress());

export const useQuestionProgress = () =>
  usePersonalityTestContext((state) => state.getQuestionProgress());
