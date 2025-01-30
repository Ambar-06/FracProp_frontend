'use client'

import { createContext, useState, useEffect, useContext } from "react";
import { useRouter, usePathname } from 'next/navigation'

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // const AuthContext = createContext(null);
  const router = useRouter()
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    console.log(storedToken)
    console.log(pathname)
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    } else if (pathname !== "/" && pathname !== "/signup") {
      router.push('/login')
    }
  }, [pathname]);


  const login = (data) => {
    setUser(data);
    setToken(data.token);
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("token", data.token);
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
