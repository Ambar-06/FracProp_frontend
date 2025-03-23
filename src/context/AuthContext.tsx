'use client';

import { createContext, useState, useEffect, useContext } from "react";
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: any;
  token: string | null;
  login: (data: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Define ignorePaths with a regular expression for dynamic paths
  const ignorePaths = [
    "/login",
    "/signup",
    "/",
    "/reset-password",
    "/careers",
    "/public/blogs",
    "/public/contact-us",
    "/team",
    "/about-us",
    /^\/public\/blogs\/[a-f0-9-]+$/, // Matches /public/blogs/{uuid}
  ];

  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to check if a path should be ignored
  const isPathIgnored = (path: string) => {
    return ignorePaths.some((pattern) => {
      if (typeof pattern === "string") {
        return path === pattern;
      } else if (pattern instanceof RegExp) {
        return pattern.test(path);
      }
      return false;
    });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);

      // Redirect to dashboard if user is logged in and on an auth-related page
      if (["/login", "/signup", "/", "/reset-password"].includes(pathname)) {
        router.push("/dashboard");
      }
    } else if (!storedToken && !isPathIgnored(pathname)) {
      // Redirect to login if user is not logged in and the path is not ignored
      router.push("/login");
    }

    setLoading(false);
  }, [pathname, router]);

  const login = (data: any) => {
    setUser(data);
    setToken(data.token);
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("token", data.token);
    router.push("/dashboard");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext) ?? { user: null, token: null, login: () => {}, logout: () => {} };
};