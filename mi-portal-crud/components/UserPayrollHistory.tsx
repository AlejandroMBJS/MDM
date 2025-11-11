// src/components/UserPayrollHistory.tsx
import React, { JSX, useState, useEffect } from "react";
import { PayrollHistory } from "../types";
import { apiFetch } from "../lib/api";
import ModalPayrollHistory from "./ModalPayrollHistory";

interface Props {
  userId: number;
}

export default function UserPayrollHistory({ userId }: Props): JSX.Element {
  const [payrollHistory, setPayrollHistory] = useState<PayrollHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<PayrollHistory | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPayrollHistory();
  }, [userId]);

  async function loadPayrollHistory() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/api/v1/users/${userId}/payroll-history/?limit=500`);
      setPayrollHistory(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar historial de nómina");
      console.error("fetchPayrollHistory error", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!confirm("¿Eliminar historial de nómina?")) return;
    try {
      await apiFetch(`/api/v1/users/${userId}/payroll-history/${id}`, { method: "DELETE" });
      loadPayrollHistory();
    } catch (err: any) {
      setError(err.message || "Error al eliminar");
    }
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Historial de Nómina</h3>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
        >
          + Nuevo Historial
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">Cargando historial de nómina...</div>
      ) : payrollHistory.length === 0 ? (
        <div className="text-gray-400">No hay historial de nómina registrado para este usuario.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {payrollHistory.map((ph) => (
            <div key={ph.id} className="bg-gray-800/50 p-4 rounded-lg shadow border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-medium">{ph.payroll_period}</div>
                  <div className="text-sm text-gray-400">Inicio: {ph.period_start}</div>
                  <div className="text-sm text-gray-400">Fin: {ph.period_end}</div>
                  <div className="text-sm text-gray-400">Neto: {ph.net_pay}</div>
                  <div className="text-sm text-gray-400">Estado: {ph.payment_status}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setEditing(ph); setModalOpen(true); }}
                    className="px-2 py-1 bg-yellow-400 text-black rounded text-sm hover:bg-yellow-500 transition duration-200"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(ph.id)}
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
        <ModalPayrollHistory
          userId={userId}
          initial={editing}
          onClose={() => { setModalOpen(false); loadPayrollHistory(); }}
        />
      )}
    </div>
  );
}