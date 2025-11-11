// src/components/UserEmployeeBenefits.tsx
import React, { JSX, useState, useEffect } from "react";
import { EmployeeBenefit } from "../types";
import { fetchEmployeeBenefits, createEmployeeBenefit, updateEmployeeBenefit, deleteEmployeeBenefit } from "../lib/api";
import ModalEmployeeBenefit from "./ModalEmployeeBenefit";

interface Props {
  userId: number;
}

export default function UserEmployeeBenefits({ userId }: Props): JSX.Element {
  const [employeeBenefits, setEmployeeBenefits] = useState<EmployeeBenefit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<EmployeeBenefit | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEmployeeBenefits();
  }, [userId]);

  async function loadEmployeeBenefits() {
    setLoading(true);
    setError(null);
    try {
      const data = (await fetchEmployeeBenefits(userId)) as EmployeeBenefit[];
      setEmployeeBenefits(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar beneficios de empleado");
      console.error("fetchEmployeeBenefits error", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!confirm("¿Eliminar beneficio de empleado?")) return;
    try {
      await deleteEmployeeBenefit(userId, id);
      loadEmployeeBenefits(); // Reload benefits after deletion
    } catch (err: any) {
      setError(err.message || "Error al eliminar");
    }
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Beneficios de Empleado</h3>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
        >
          + Nuevo Beneficio
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">Cargando beneficios...</div>
      ) : employeeBenefits.length === 0 ? (
        <div className="text-gray-400">No hay beneficios de empleado registrados para este usuario.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {employeeBenefits.map((eb) => (
            <div key={eb.id} className="bg-gray-800/50 p-4 rounded-lg shadow border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-medium">{eb.benefit_name}</div>
                  <div className="text-sm text-gray-400">Tipo: {eb.benefit_type}</div>
                  <div className="text-sm text-gray-400">Proveedor: {eb.provider}</div>
                  <div className="text-sm text-gray-400">Inicio: {eb.start_date}</div>
                  {eb.end_date && <div className="text-sm text-gray-400">Fin: {eb.end_date}</div>}
                  {eb.is_active && <div className="text-sm text-green-400">Activo</div>}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setEditing(eb); setModalOpen(true); }}
                    className="px-2 py-1 bg-yellow-400 text-black rounded text-sm hover:bg-yellow-500 transition duration-200"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(eb.id)}
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
        <ModalEmployeeBenefit
          userId={userId}
          initial={editing}
          onClose={() => { setModalOpen(false); loadEmployeeBenefits(); }}
        />
      )}
    </div>
  );
}
