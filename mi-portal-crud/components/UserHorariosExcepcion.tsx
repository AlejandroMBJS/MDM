// src/components/UserHorariosExcepcion.tsx
import React, { JSX, useState, useEffect } from "react";
import { HorarioExcepcion } from "../types";
import { apiFetch } from "../lib/api";
import ModalHorarioExcepcion from "./ModalHorarioExcepcion";

interface Props {
  userId: number;
}

export default function UserHorariosExcepcion({ userId }: Props): JSX.Element {
  const [horariosExcepcion, setHorariosExcepcion] = useState<HorarioExcepcion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<HorarioExcepcion | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHorariosExcepcion();
  }, [userId]);

  async function loadHorariosExcepcion() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/api/v1/users/${userId}/horarios-excepcion/?limit=500`);
      setHorariosExcepcion(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar horarios de excepción");
      console.error("fetchHorariosExcepcion error", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!confirm("¿Eliminar horario de excepción?")) return;
    try {
      await apiFetch(`/api/v1/users/${userId}/horarios-excepcion/${id}`, { method: "DELETE" });
      loadHorariosExcepcion();
    } catch (err: any) {
      setError(err.message || "Error al eliminar");
    }
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Horarios de Excepción</h3>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
        >
          + Nuevo Horario Excepción
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">Cargando horarios de excepción...</div>
      ) : horariosExcepcion.length === 0 ? (
        <div className="text-gray-400">No hay horarios de excepción registrados para este usuario.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {horariosExcepcion.map((he) => (
            <div key={he.id} className="bg-gray-800/50 p-4 rounded-lg shadow border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-medium">Excepción: {he.fecha_inicio} - {he.fecha_fin}</div>
                  <div className="text-sm text-gray-400">Turno ID: {he.turno_id}</div>
                  <div className="text-sm text-gray-400">Estado: {he.estado}</div>
                  {he.motivo && <div className="text-sm text-gray-400">Motivo: {he.motivo}</div>}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setEditing(he); setModalOpen(true); }}
                    className="px-2 py-1 bg-yellow-400 text-black rounded text-sm hover:bg-yellow-500 transition duration-200"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(he.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition duration-200"
                  >
                    Borrar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <div className="text-red-400 mt-4 text-sm bg-red-900/50 p-3 rounded-lg">{error}</div>}

      {modalOpen && (
        <ModalHorarioExcepcion
          userId={userId}
          initial={editing}
          onClose={() => { setModalOpen(false); loadHorariosExcepcion(); }}
        />
      )}
    </div>
  );
}