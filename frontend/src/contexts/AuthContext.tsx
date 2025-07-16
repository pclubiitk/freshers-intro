// AuthContext.tsx
'use client'
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AuthContextType {
    user: any;
    loading: boolean;
    isAuthenticated: boolean;
}


export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // important to avoid flash
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8000/auth/me", {
        credentials: "include"
        })
        .then(res => {
            if (!res.ok) throw new Error("Not authenticated");
            return res.json();
        })
        .then(data => {
            setUser(data);
            setIsAuthenticated(true);
        })
        .catch(() => {
            setUser(null);
            setIsAuthenticated(false);
        })
        .finally(() => setLoading(false));
    }, []);


    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}
