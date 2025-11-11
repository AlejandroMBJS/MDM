// src/app/emergency-contacts/page.tsx
"use client";
import React, { JSX, useEffect, useState } from "react";
import { EmergencyContact } from "../../types";
import { fetchEmergencyContacts, deleteEmergencyContact } from "../../lib/api";
import Navbar from "../../components/Navbar";
import ModalEmergencyContact from "../../components/ModalEmergencyContact";
import { useRouter } from "next/navigation";
import { parseJwt } from "../../lib/api";

export default function EmergencyContactsPage(): JSX.Element {
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<EmergencyContact | null>(null);
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
    loadEmergencyContacts();
  }, [router]);

  async function loadEmergencyContacts() {
    setLoading(true);
    try {
      const data = (await fetchEmergencyContacts()) as EmergencyContact[];
      setEmergencyContacts(data);
    } catch (err) {
      console.error("fetchEmergencyContacts error", err);
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
    if (!confirm("¿Eliminar contacto de emergencia?")) return;
    try {
      await deleteEmergencyContact(id);
      setEmergencyContacts((prev) => prev.filter((p) => p.id !== id));
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
        <h2 className="text-2xl font-semibold">Gestión de Contactos de Emergencia</h2>
        <div>
          <button
            onClick={() => { setEditing(null); setModalOpen(true); }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
          >
            + Nuevo Contacto
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="text-gray-400">Cargando...</div>
        ) : emergencyContacts.length === 0 ? (
          <div className="text-gray-400">No hay contactos de emergencia.</div>
        ) : (
          emergencyContacts.map((ec) => (
            <div key={ec.id} className="bg-gray-800/50 p-4 rounded-2xl shadow border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-medium">{ec.contact_name}</div>
                  <div className="text-sm text-gray-400">Empleado ID: {ec.employee_id}</div>
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
              <div className="mt-3 text-xs text-gray-400">
                Creado: {ec.created_at ? new Date(ec.created_at).toLocaleString() : "-"}
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <ModalEmergencyContact
          initial={editing}
          onClose={() => { setModalOpen(false); loadEmergencyContacts(); }}
        />
      )}
    </div>
  );
}
