import { createContext, useState, useContext, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext();

// custom hook so we dont have to import useContext everywhere
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // check if user info exists in localStorage on first load
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // login function
  const login = async (email, password) => {
    const response = await API.post("/auth/login", { email, password });
    const userData = response.data;
    setUser(userData);
    localStorage.setItem("userInfo", JSON.stringify(userData));
    return userData;
  };

  // register function
  const register = async (name, email, password, role) => {
    const response = await API.post("/auth/register", {
      name,
      email,
      password,
      role,
    });
    const userData = response.data;
    setUser(userData);
    localStorage.setItem("userInfo", JSON.stringify(userData));
    return userData;
  };

  // logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
