import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    return token ? { token, username } : null;
  });
  const navigate = useNavigate();

  const login = useCallback((token, username) => {
    localStorage.setItem("token", token);
    if (username) {
      localStorage.setItem("username", username);
    }
    setUser({ token, username });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
    navigate("/");
  }, [navigate]);

  return { user, login, logout };
};
