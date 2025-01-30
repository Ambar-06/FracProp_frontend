'use client'

import { createContext, useState, useEffect, useContext } from "react";
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  
  const [user, setUser] = useState(() => localStorage.getItem("user"));
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    } else if (!storedToken && pathname !== "/login" && pathname !== "/signup") {
      router.push('/login');
    }
  }, [pathname, router]);

  const login = (data) => {
    setUser(data);
    setToken(data.token);
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("token", data.token);
    router.push('/dashboard');  // Redirect to dashboard after login
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
