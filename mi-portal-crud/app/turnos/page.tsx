// src/app/turnos/page.tsx
"use client";
import React, { JSX, useEffect, useState } from "react";
import { Turno } from "../../types";
import { fetchTurnos, deleteTurno } from "../../lib/api";
import Navbar from "../../components/Navbar";
import ModalTurno from "../../components/ModalTurno";
import { useRouter } from "next/navigation";
import { parseJwt } from "../../lib/api";

export default function TurnosPage(): JSX.Element {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<Turno | null>(null);
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
    loadTurnos();
  }, [router]);

  async function loadTurnos() {
    setLoading(true);
    try {
      const data = (await fetchTurnos()) as Turno[];
      setTurnos(data);
    } catch (err) {
      console.error("fetchTurnos error", err);
      // If token is expired or invalid, redirect to login
      if (err instanceof Error && (err.message.includes("401") || err.message.includes("403"))) {
        localStorage.removeItem("mdm_token");
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!confirm("¿Eliminar turno?")) return;
    try {
      await deleteTurno(id);
      setTurnos((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || "Error al eliminar");
    }
  }

  function handleLogout() {
    localStorage.removeItem("mdm_token");
    router.push("/login");
  }

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <Navbar onLogout={handleLogout} onOpenCreateUser={() => {}} role={role} />

      <div className="mt-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Gestión de Turnos</h2>
        <div>
          <button
            onClick={() => { setEditing(null); setModalOpen(true); }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
          >
            + Nuevo Turno
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="text-gray-400">Cargando...</div>
        ) : turnos.length === 0 ? (
          <div className="text-gray-400">No hay turnos.</div>
        ) : (
          turnos.map((t) => (
            <div key={t.id} className="bg-gray-800/50 p-4 rounded-2xl shadow border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-medium">{t.nombre} ({t.codigo})</div>
                  <div className="text-sm text-gray-400">
                    {t.hora_inicio} - {t.hora_fin}
                  </div>
                  <div className="text-sm text-gray-400">
                    {t.es_descanso ? "Día de Descanso" : "Día Laboral"}
                  </div>
                  <div className="text-sm text-gray-400">
                    Estado: {t.activo ? "Activo" : "Inactivo"}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setEditing(t); setModalOpen(true); }}
                    className="px-2 py-1 bg-yellow-400 text-black rounded text-sm hover:bg-yellow-500 transition duration-200"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition duration-200"
                  >
                    Borrar
                  </button>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-400">
                Creado: {t.created_at ? new Date(t.created_at).toLocaleString() : "-"}
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <ModalTurno
          initial={editing}
          onClose={() => { setModalOpen(false); loadTurnos(); }}
        />
      )}
    </div>
  );
}
