// src/components/ModalNotification.tsx
import React, { JSX, useState, useEffect } from "react";
import { Notification } from "../types";
import { createNotification, updateNotification } from "../lib/api";

interface Props {
  userId: number;
  initial?: Notification | null;
  onClose: () => void;
}

export default function ModalNotification({ userId, initial, onClose }: Props): JSX.Element {
  const [notificationUserId, setNotificationUserId] = useState<number>(userId);
  const [requestId, setRequestId] = useState<number | undefined>(undefined);
  const [message, setMessage] = useState<string>("");
  const [isRead, setIsRead] = useState<boolean>(false);
  const [notificationType, setNotificationType] = useState<string>("");
  const [readAt, setReadAt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setNotificationUserId(initial.user_id);
      setRequestId(initial.request_id || undefined);
      setMessage(initial.message);
      setIsRead(initial.is_read || false);
      setNotificationType(initial.notification_type || "");
      setReadAt(initial.read_at ? new Date(initial.read_at).toISOString().split('T')[0] : "");
    }
  }, [initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        user_id: notificationUserId,
        request_id: requestId || null,
        message: message,
        is_read: isRead,
        notification_type: notificationType || null,
        read_at: readAt ? new Date(readAt).toISOString() : null,
      };
      if (initial?.id) {
        await updateNotification(userId, initial.id, payload);
      } else {
        await createNotification(userId, payload);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-white">{initial ? "Editar Notificación" : "Nueva Notificación"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">ID de Usuario</label>
            <input
              type="number"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={notificationUserId}
              onChange={(e) => setNotificationUserId(parseInt(e.target.value))}
              required
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">ID de Solicitud (Opcional)</label>
            <input
              type="number"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={requestId || ""}
              onChange={(e) => setRequestId(parseInt(e.target.value) || undefined)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Mensaje</label>
            <textarea
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="isRead"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
              checked={isRead}
              onChange={(e) => setIsRead(e.target.checked)}
            />
            <label htmlFor="isRead" className="ml-2 block text-sm text-gray-300">Leída</label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de Notificación</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={notificationType}
              onChange={(e) => setNotificationType(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Fecha de Lectura</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={readAt}
              onChange={(e) => setReadAt(e.target.value)}
            />
          </div>

          {error && <div className="text-red-400 mb-4 text-sm bg-red-900/50 p-3 rounded-lg">{error}</div>}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
