'use client';

import { createContext, useState, useEffect, useContext } from "react";
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);

      // Redirect logged-in users away from login/signup
      if (pathname === "/login" || pathname === "/signup" || pathname === "/") {
        router.push("/dashboard"); // Redirect to dashboard
      }
    } else if (!storedToken && pathname !== "/login" && pathname !== "/signup" && pathname !== "/") {
      console.log("Pathname:", pathname);
      console.log("Redirecting to login...");
      router.push("/login"); // Redirect to login if not authenticated
    }

    setLoading(false);
  }, [pathname, router]);

  const login = (data) => {
    setUser(data);
    setToken(data.token);

    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("token", data.token);

    router.push("/dashboard"); // Redirect to dashboard after login
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    router.push("/login");
  };

  if (loading) {
    return null; // Show loader if necessary
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
