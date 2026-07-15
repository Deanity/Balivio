import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type User = { name: string; email: string };

type AuthCtx = {
  user: User | null;
  login: (name: string, email: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
};

const AuthContext = createContext<AuthCtx | null>(null);

const STORAGE_KEY = "balivio-user";

/** Baca sesi dari localStorage secara sinkron — dipakai untuk route guards (beforeLoad) */
export const getStoredUser = (): User | null => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as User) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const login = (name: string, email: string) => {
    const u: User = { name, email };
    setUser(u);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } catch {
      // ignore
    }
  };

  const logout = () => {
    setUser(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
