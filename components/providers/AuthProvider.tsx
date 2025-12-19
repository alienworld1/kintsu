"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface AuthContextType {
  anonId: string | null;
}

const AuthContext = createContext<AuthContextType>({ anonId: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [anonId, setAnonId] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing anon_id in localStorage
    let storedId = localStorage.getItem("kintsu_anon_id");
    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem("kintsu_anon_id", storedId);
    }
    setAnonId(storedId);
  }, []);

  return (
    <AuthContext.Provider value={{ anonId }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
