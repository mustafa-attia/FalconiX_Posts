import { createContext } from "react";

export type AuthContextType = {
  token: string | null;
  updateToken: (token: string | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  updateToken: () => undefined,
});


