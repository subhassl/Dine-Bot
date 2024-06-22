import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || null,
    username: localStorage.getItem("username") || null,
  });

  useEffect(() => {
    if (auth.token) {
      localStorage.setItem("token", auth.token);
      localStorage.setItem("username", auth.username);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
    }
  }, [auth]);

  const login = (token, username) => {
    setAuth({ token, username });
  };

  const logout = () => {
    setAuth({ token: null, username: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
