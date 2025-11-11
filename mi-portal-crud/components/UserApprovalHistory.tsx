// src/components/UserApprovalHistory.tsx
import React, { JSX, useState, useEffect } from "react";
import { ApprovalHistory } from "../types";
import { apiFetch } from "../lib/api";
import ModalApprovalHistory from "./ModalApprovalHistory";

interface Props {
  userId: number;
}

export default function UserApprovalHistory({ userId }: Props): JSX.Element {
  const [approvalHistory, setApprovalHistory] = useState<ApprovalHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<ApprovalHistory | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadApprovalHistory();
  }, [userId]);

  async function loadApprovalHistory() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/api/v1/users/${userId}/approval-history/?limit=500`);
      setApprovalHistory(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar historial de aprobación");
      console.error("fetchApprovalHistory error", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!confirm("¿Eliminar historial de aprobación?")) return;
    try {
      await apiFetch(`/api/v1/users/${userId}/approval-history/${id}`, { method: "DELETE" });
      loadApprovalHistory();
    } catch (err: any) {
      setError(err.message || "Error al eliminar");
    }
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Historial de Aprobación</h3>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
        >
          + Nuevo Historial
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">Cargando historial de aprobación...</div>
      ) : approvalHistory.length === 0 ? (
        <div className="text-gray-400">No hay historial de aprobación registrado para este usuario.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {approvalHistory.map((ah) => (
            <div key={ah.id} className="bg-gray-800/50 p-4 rounded-lg shadow border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-medium">Solicitud ID: {ah.request_id}</div>
                  <div className="text-sm text-gray-400">Etapa: {ah.approval_stage}</div>
                  <div className="text-sm text-gray-400">Acción: {ah.action}</div>
                  {ah.comments && <div className="text-sm text-gray-400">Comentarios: {ah.comments}</div>}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setEditing(ah); setModalOpen(true); }}
                    className="px-2 py-1 bg-yellow-400 text-black rounded text-sm hover:bg-yellow-500 transition duration-200"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(ah.id)}
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
        <ModalApprovalHistory
          userId={userId}
          initial={editing}
          onClose={() => { setModalOpen(false); loadApprovalHistory(); }}
        />
      )}
    </div>
  );
}