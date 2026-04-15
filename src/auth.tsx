import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getToken,
  loginRequest,
  meRequest,
  setStoredToken,
} from "./api/campaignApi";

type AuthContextValue = {
  isAdmin: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const t = getToken();
    if (!t) return;
    void meRequest(t).then((ok) => {
      if (ok) setIsAdmin(true);
      else setStoredToken(null);
    });
  }, []);

  const login = useCallback(async (password: string) => {
    try {
      const token = await loginRequest(password);
      setStoredToken(token);
      setIsAdmin(true);
      return true;
    } catch {
      setStoredToken(null);
      setIsAdmin(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setStoredToken(null);
    setIsAdmin(false);
  }, []);

  const value = useMemo(
    () => ({ isAdmin, login, logout }),
    [isAdmin, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth outside AuthProvider");
  return ctx;
}
