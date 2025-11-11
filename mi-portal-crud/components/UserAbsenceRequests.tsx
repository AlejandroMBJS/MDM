// src/components/UserAbsenceRequests.tsx
import React, { JSX, useState, useEffect } from "react";
import { AbsenceRequest } from "../types";
import { fetchAbsenceRequests, deleteAbsenceRequest } from "../lib/api";
import ModalAbsenceRequest from "./ModalAbsenceRequest";

interface Props {
  userId: number;
}

export default function UserAbsenceRequests({ userId }: Props): JSX.Element {
  const [absenceRequests, setAbsenceRequests] = useState<AbsenceRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<AbsenceRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAbsenceRequests();
  }, [userId]);

  async function loadAbsenceRequests() {
    setLoading(true);
    setError(null);
    try {
      const data = (await fetchAbsenceRequests(userId)) as AbsenceRequest[];
      setAbsenceRequests(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar solicitudes de ausencia");
      console.error("fetchAbsenceRequests error", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!confirm("¿Eliminar solicitud de ausencia?")) return;
    try {
      await deleteAbsenceRequest(userId, id);
      loadAbsenceRequests(); // Reload requests after deletion
    } catch (err: any) {
      setError(err.message || "Error al eliminar");
    }
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Solicitudes de Ausencia</h3>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
        >
          + Nueva Solicitud
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">Cargando solicitudes de ausencia...</div>
      ) : absenceRequests.length === 0 ? (
        <div className="text-gray-400">No hay solicitudes de ausencia registradas para este usuario.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {absenceRequests.map((ar) => (
            <div key={ar.id} className="bg-gray-800/50 p-4 rounded-lg shadow border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-medium">{ar.request_type}</div>
                  <div className="text-sm text-gray-400">Desde: {ar.start_date}</div>
                  <div className="text-sm text-gray-400">Hasta: {ar.end_date}</div>
                  <div className="text-sm text-gray-400">Días: {ar.total_days}</div>
                  <div className="text-sm text-gray-400">Estado: {ar.status}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setEditing(ar); setModalOpen(true); }}
                    className="px-2 py-1 bg-yellow-400 text-black rounded text-sm hover:bg-yellow-500 transition duration-200"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(ar.id)}
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
        <ModalAbsenceRequest
          userId={userId}
          initial={editing}
          onClose={() => { setModalOpen(false); loadAbsenceRequests(); }}
        />
      )}
    </div>
  );
}
