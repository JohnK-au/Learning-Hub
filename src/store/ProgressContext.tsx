import { createContext, useContext, type ReactNode } from "react";
import { progressStore } from "@/store/LocalStorageStore.ts";
import type { ProgressStore } from "@/store/ProgressStore.ts";

/**
 * Makes the ProgressStore available to the React tree.
 *
 * Components ask for "the store" through context rather than importing the
 * concrete singleton, so a different implementation (e.g. a fake store in a
 * test, or a future SupabaseStore) can be injected at the provider without any
 * component changing.
 */
const ProgressStoreContext = createContext<ProgressStore>(progressStore);

export function ProgressProvider({
  children,
  store = progressStore,
}: {
  children: ReactNode;
  store?: ProgressStore;
}) {
  return (
    <ProgressStoreContext.Provider value={store}>
      {children}
    </ProgressStoreContext.Provider>
  );
}

/** Access the active ProgressStore. */
export function useProgressStore(): ProgressStore {
  return useContext(ProgressStoreContext);
}
