'use client';

import { createContext, useState, useEffect, useContext } from "react";
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Initialize state as null (avoid SSR issue)
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } else if (!storedToken && pathname !== "/login" && pathname !== "/signup") {
        router.push('/login');
    }
    setLoading(false); 
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

  if (loading) {
    return null; // You can show a loader if you want to wait for the context to be set
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
