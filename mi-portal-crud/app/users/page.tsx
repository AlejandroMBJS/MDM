// src/app/users/page.tsx
"use client";
import React, { JSX, useEffect, useState } from "react";
import { User } from "../../types";
import { fetchUsers } from "../../lib/api";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";
import { parseJwt } from "../../lib/api";

export default function UsersPage(): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("mdm_token");
    if (!token) {
      router.push("/login");
      return;
    }
    const decodedToken = parseJwt(token);
    if (decodedToken && decodedToken.role) {
      setRole(decodedToken.role);
    }
    loadUsers();
  }, [router]);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = (await fetchUsers()) as User[];
      setUsers(data);
    } catch (err) {
      console.error("fetchUsers error", err);
      if (err instanceof Error && (err.message.includes("401") || err.message.includes("403"))) {
        localStorage.removeItem("mdm_token");
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("mdm_token");
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-900 text-white">
        <Navbar onLogout={handleLogout} onOpenCreateUser={() => {}} role={role} />
        <div className="mt-6 text-gray-400">Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <Navbar onLogout={handleLogout} onOpenCreateUser={() => {}} role={role} />

      <div className="mt-6">
        <h2 className="text-3xl font-bold mb-4">Gestión de Usuarios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {users.map((user) => (
            <div key={user.id} className="bg-gray-800/50 p-4 rounded-lg shadow border border-gray-700">
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-gray-400">{user.email}</p>
              <p className="text-gray-400">Rol: {user.role}</p>
              <p className="text-gray-400">Activo: {user.is_active ? "Sí" : "No"}</p>
              <div className="mt-4">
                <a href={`/users/${user.id}`} className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200">Ver Detalles</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
