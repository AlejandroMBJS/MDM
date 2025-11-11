// src/components/Login.tsx
import React, { JSX, useState } from "react";
import { login } from "../lib/api";
import type { LoginResponse } from "../types";

interface Props {
  onLogin: (jwt: string) => void;
}

export default function Login({ onLogin }: Props): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = (await login(email, password)) as LoginResponse;
      if (!data?.access_token) throw new Error("Token no recibido");
      // guarda token
      localStorage.setItem("mdm_token", data.access_token);
      onLogin(data.access_token);
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form onSubmit={handleSubmit} className="w-[420px] bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-white text-center">MDM Portal</h1>

        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
        <input
          className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 mt-1 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          placeholder="you@example.com"
        />

        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
        <input
          className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 mt-1 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          placeholder="••••••••"
        />

        {error && <div className="text-red-400 mb-4 text-sm bg-red-900/50 p-3 rounded-lg">{error}</div>}

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 disabled:opacity-50 transition duration-200"
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
