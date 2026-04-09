import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { apiClient, clearAuthTokens, setAuthTokens, type MeResponse } from "@/lib/api";

type AuthContextValue = {
  user: MeResponse["user"] | null;
  profile: MeResponse["profile"] | null;
  roles: string[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<MeResponse>;
  register: (data: { username: string; email: string; password: string; full_name?: string }) => Promise<MeResponse>;
  logout: () => void;
  refreshUser: () => Promise<MeResponse | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function applySession(session: MeResponse | null, setSession: (value: MeResponse | null) => void) {
  setSession(session);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    const hasStoredToken = localStorage.getItem("access_token") || localStorage.getItem("refresh_token");
    if (!hasStoredToken) {
      applySession(null, setSession);
      return null;
    }

    try {
      const me = await apiClient.me();
      applySession(me, setSession);
      return me;
    } catch {
      clearAuthTokens();
      applySession(null, setSession);
      return null;
    }
  };

  useEffect(() => {
    void (async () => {
      await refreshUser();
      setIsLoading(false);
    })();
  }, []);

  const login = async (identifier: string, password: string) => {
    const tokens = await apiClient.login(identifier, password);
    setAuthTokens(tokens);
    const me = await apiClient.me();
    applySession(me, setSession);
    return me;
  };

  const register = async (data: { username: string; email: string; password: string; full_name?: string }) => {
    const response = await apiClient.register(data);
    setAuthTokens(response.tokens);
    const me = await apiClient.me();
    applySession(me, setSession);
    return me;
  };

  const logout = () => {
    clearAuthTokens();
    applySession(null, setSession);
  };

  const value: AuthContextValue = {
    user: session?.user ?? null,
    profile: session?.profile ?? null,
    roles: session?.roles ?? [],
    isAuthenticated: Boolean(session?.user),
    isAdmin: session?.roles.includes("admin") ?? false,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
