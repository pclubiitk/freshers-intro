// AuthContext.tsx
'use client'
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AuthContextType {
    user: any;
    loading_or_not: boolean;
    isAuthenticated: boolean;
    refreshUser: () => Promise<void>;
}


export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN
    const [user, setUser] = useState(null);
    const [loading_or_not, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const refreshUser = async () => {
    try {
      const res = await fetch(`${ORIGIN}/auth/me`, {
        credentials: "include",
        cache: 'no-store'
      });
      if (!res.ok) throw new Error("Not authenticated");
      const data = await res.json();
      setUser(data);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };



    useEffect(() => {
        refreshUser();
    }, []);


    return (
        <AuthContext.Provider value={{ user, loading_or_not, isAuthenticated, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}
