// src/components/UserEmergencyContacts.tsx
import React, { JSX, useState, useEffect } from "react";
import { EmergencyContact } from "../types";
import { apiFetch } from "../lib/api";
import ModalEmergencyContact from "./ModalEmergencyContact";

interface Props {
  userId: number;
}

export default function UserEmergencyContacts({ userId }: Props): JSX.Element {
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<EmergencyContact | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEmergencyContacts();
  }, [userId]);

  async function loadEmergencyContacts() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/api/v1/users/${userId}/emergency-contacts/?limit=500`);
      setEmergencyContacts(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar contactos de emergencia");
      console.error("fetchEmergencyContacts error", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!confirm("¿Eliminar contacto de emergencia?")) return;
    try {
      await apiFetch(`/api/v1/users/${userId}/emergency-contacts/${id}`, { method: "DELETE" });
      loadEmergencyContacts();
    } catch (err: any) {
      setError(err.message || "Error al eliminar");
    }
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Contactos de Emergencia</h3>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
        >
          + Nuevo Contacto
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">Cargando contactos...</div>
      ) : emergencyContacts.length === 0 ? (
        <div className="text-gray-400">No hay contactos de emergencia registrados para este usuario.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyContacts.map((ec) => (
            <div key={ec.id} className="bg-gray-800/50 p-4 rounded-lg shadow border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-medium">{ec.contact_name}</div>
                  <div className="text-sm text-gray-400">Relación: {ec.relationship}</div>
                  <div className="text-sm text-gray-400">Teléfono: {ec.phone_number}</div>
                  {ec.email && <div className="text-sm text-gray-400">Email: {ec.email}</div>}
                  {ec.is_primary && <div className="text-sm text-green-400">Contacto Principal</div>}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setEditing(ec); setModalOpen(true); }}
                    className="px-2 py-1 bg-yellow-400 text-black rounded text-sm hover:bg-yellow-500 transition duration-200"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(ec.id)}
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
        <ModalEmergencyContact
          userId={userId}
          initial={editing}
          onClose={() => { setModalOpen(false); loadEmergencyContacts(); }}
        />
      )}
    </div>
  );
}