// src/components/UserEmployeeDocuments.tsx
import React, { JSX, useState, useEffect } from "react";
import { EmployeeDocument } from "../types";
import { fetchEmployeeDocuments, createEmployeeDocument, updateEmployeeDocument, deleteEmployeeDocument } from "../lib/api";
import ModalEmployeeDocument from "./ModalEmployeeDocument";

interface Props {
  userId: number;
}

export default function UserEmployeeDocuments({ userId }: Props): JSX.Element {
  const [employeeDocuments, setEmployeeDocuments] = useState<EmployeeDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<EmployeeDocument | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEmployeeDocuments();
  }, [userId]);

  async function loadEmployeeDocuments() {
    setLoading(true);
    setError(null);
    try {
      const data = (await fetchEmployeeDocuments(userId)) as EmployeeDocument[];
      setEmployeeDocuments(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar documentos de empleado");
      console.error("fetchEmployeeDocuments error", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!confirm("¿Eliminar documento de empleado?")) return;
    try {
      await deleteEmployeeDocument(userId, id);
      loadEmployeeDocuments(); // Reload documents after deletion
    } catch (err: any) {
      setError(err.message || "Error al eliminar");
    }
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Documentos de Empleado</h3>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
        >
          + Nuevo Documento
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">Cargando documentos...</div>
      ) : employeeDocuments.length === 0 ? (
        <div className="text-gray-400">No hay documentos de empleado registrados para este usuario.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {employeeDocuments.map((doc) => (
            <div key={doc.id} className="bg-gray-800/50 p-4 rounded-lg shadow border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-medium">{doc.document_name}</div>
                  <div className="text-sm text-gray-400">Tipo: {doc.document_type}</div>
                  {doc.expiration_date && <div className="text-sm text-gray-400">Expira: {doc.expiration_date}</div>}
                  {doc.is_verified && <div className="text-sm text-green-400">Verificado</div>}
                  {doc.file_url && <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline">Ver Archivo</a>}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setEditing(doc); setModalOpen(true); }}
                    className="px-2 py-1 bg-yellow-400 text-black rounded text-sm hover:bg-yellow-500 transition duration-200"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
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
        <ModalEmployeeDocument
          userId={userId}
          initial={editing}
          onClose={() => { setModalOpen(false); loadEmployeeDocuments(); }}
        />
      )}
    </div>
  );
}
