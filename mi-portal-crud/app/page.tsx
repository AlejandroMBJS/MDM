"use client";

import React, { JSX, useEffect, useState } from "react";
import Login from "@/components/Login";
import Dashboard from "@/components/Dashboard";
import { getToken, parseJwt, removeToken } from "@/lib/api";

export default function App(): JSX.Element {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) {
      setToken(storedToken);
      const payload = parseJwt(storedToken);
      setRole(payload?.role ?? null);
    }
  }, []);

  const handleLogin = (jwt: string) => {
    setToken(jwt);
    const payload = parseJwt(jwt);
    setRole(payload?.role ?? null);
    localStorage.setItem("mdm_token", jwt);
  };

  const handleLogout = () => {
    removeToken();
    setToken(null);
    setRole(null);
  };

  return (
    <div className="min-h-screen bg-slate-100/50">
      {!token ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard token={token} role={role} onLogout={handleLogout} />
      )}
    </div>
  );
}
