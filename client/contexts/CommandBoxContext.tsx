import { Context, createContext, ReactNode, useState } from "react";

const CommandBoxState = () => useState<boolean>(false);
export type CommandBoxType = ReturnType<typeof CommandBoxState>;

export const CommandBoxContext = createContext<CommandBoxType | null>(
  null
) as Context<CommandBoxType>;

const CommandBoxContextProvider = ({ children }: { children: ReactNode }) => (
  <CommandBoxContext.Provider value={useState<boolean>(false)}>
    {children}
  </CommandBoxContext.Provider>
);

export default CommandBoxContextProvider;
