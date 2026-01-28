import React, { createContext, useEffect, useState } from "react";
import { loginApi, registerApi, getMeApi } from "../api/auth";

export const AuthContext = createContext();

let TOKEN = null; 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    TOKEN = res.data.data.token;
    setUser(res.data.data);
  };

  const register = async (data) => {
    const res = await registerApi(data);
    TOKEN = res.data.data.token;
    setUser(res.data.data);
  };

  const logout = async () => {
    TOKEN = null;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, TOKEN }}>
      {children}
    </AuthContext.Provider>
  );
};
