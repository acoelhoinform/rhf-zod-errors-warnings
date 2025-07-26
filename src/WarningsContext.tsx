import { createContext, useContext } from "react";

type WarningsContextType = {
  warnings: Record<string, string>;
};

export const WarningsContext = createContext<WarningsContextType>({
  warnings: {},
});

export const useWarnings = () => {
  return useContext(WarningsContext);
};
