// src/components/UserNotifications.tsx
import React, { JSX, useState, useEffect } from "react";
import { Notification } from "../types";
import { apiFetch } from "../lib/api";
import ModalNotification from "./ModalNotification";

interface Props {
  userId: number;
}

export default function UserNotifications({ userId }: Props): JSX.Element {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<Notification | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNotifications();
  }, [userId]);

  async function loadNotifications() {
    setLoading(true);
    setError(null);
    try {
      const data = (await apiFetch(`/api/v1/users/${userId}/notifications/?limit=500`)) as Notification[];
      setNotifications(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar notificaciones");
      console.error("fetchNotifications error", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!confirm("¿Eliminar notificación?")) return;
    try {
      await apiFetch(`/api/v1/users/${userId}/notifications/${id}`, { method: "DELETE" });
      loadNotifications();
    } catch (err: any) {
      setError(err.message || "Error al eliminar");
    }
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Notificaciones</h3>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
        >
          + Nueva Notificación
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">Cargando notificaciones...</div>
      ) : notifications.length === 0 ? (
        <div className="text-gray-400">No hay notificaciones registradas para este usuario.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notifications.map((n) => (
            <div key={n.id} className="bg-gray-800/50 p-4 rounded-lg shadow border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-medium">{n.message}</div>
                  <div className="text-sm text-gray-400">Tipo: {n.notification_type}</div>
                  <div className="text-sm text-gray-400">Leída: {n.is_read ? "Sí" : "No"}</div>
                  {n.read_at && <div className="text-sm text-gray-400">Fecha de Lectura: {n.read_at}</div>}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setEditing(n); setModalOpen(true); }}
                    className="px-2 py-1 bg-yellow-400 text-black rounded text-sm hover:bg-yellow-500 transition duration-200"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(n.id)}
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
        <ModalNotification
          userId={userId}
          initial={editing}
          onClose={() => { setModalOpen(false); loadNotifications(); }}
        />
      )}
    </div>
  );
}
