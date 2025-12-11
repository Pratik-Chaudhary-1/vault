import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token) {
      setUser({ token, username });
    }
    setLoading(false);
  }, []);

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

  return { user, loading, login, logout };
};
