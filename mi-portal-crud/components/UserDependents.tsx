// src/components/UserDependents.tsx
import React, { JSX, useState, useEffect } from "react";
import { Dependent } from "../types";
import { fetchDependents, createDependent, updateDependent, deleteDependent } from "../lib/api";
import ModalDependent from "./ModalDependent";

interface Props {
  userId: number;
}

export default function UserDependents({ userId }: Props): JSX.Element {
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<Dependent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDependents();
  }, [userId]);

  async function loadDependents() {
    setLoading(true);
    setError(null);
    try {
      const data = (await fetchDependents(userId)) as Dependent[];
      setDependents(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar dependientes");
      console.error("fetchDependents error", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!confirm("¿Eliminar dependiente?")) return;
    try {
      await deleteDependent(userId, id);
      loadDependents(); // Reload dependents after deletion
    } catch (err: any) {
      setError(err.message || "Error al eliminar");
    }
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Dependientes</h3>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
        >
          + Nuevo Dependiente
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">Cargando dependientes...</div>
      ) : dependents.length === 0 ? (
        <div className="text-gray-400">No hay dependientes registrados para este usuario.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dependents.map((dep) => (
            <div key={dep.id} className="bg-gray-800/50 p-4 rounded-lg shadow border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-medium">{dep.dependent_name}</div>
                  <div className="text-sm text-gray-400">Relación: {dep.relationship}</div>
                  {dep.birth_date && <div className="text-sm text-gray-400">Fecha de Nacimiento: {dep.birth_date}</div>}
                  {dep.gender && <div className="text-sm text-gray-400">Género: {dep.gender}</div>}
                  {dep.is_beneficiary && <div className="text-sm text-green-400">Beneficiario ({dep.beneficiary_percentage || 0}%)</div>}
                  {dep.has_disability && <div className="text-sm text-yellow-400">Tiene Discapacidad</div>}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setEditing(dep); setModalOpen(true); }}
                    className="px-2 py-1 bg-yellow-400 text-black rounded text-sm hover:bg-yellow-500 transition duration-200"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(dep.id)}
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
        <ModalDependent
          userId={userId}
          initial={editing}
          onClose={() => { setModalOpen(false); loadDependents(); }}
        />
      )}
    </div>
  );
}
