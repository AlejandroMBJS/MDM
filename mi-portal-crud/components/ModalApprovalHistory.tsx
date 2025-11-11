// src/components/ModalApprovalHistory.tsx
import React, { JSX, useState, useEffect } from "react";
import { ApprovalHistory } from "../types";
import { createApprovalHistory, updateApprovalHistory } from "../lib/api";

interface Props {
  userId: number;
  initial?: ApprovalHistory | null;
  onClose: () => void;
}

export default function ModalApprovalHistory({ userId, initial, onClose }: Props): JSX.Element {
  const [requestId, setRequestId] = useState<number>(0);
  const [approverId, setApproverId] = useState<number>(userId);
  const [approvalStage, setApprovalStage] = useState<string>("");
  const [action, setAction] = useState<string>("");
  const [comments, setComments] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setRequestId(initial.request_id);
      setApproverId(initial.approver_id);
      setApprovalStage(initial.approval_stage);
      setAction(initial.action);
      setComments(initial.comments || "");
    }
  }, [initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        request_id: requestId,
        approver_id: approverId,
        approval_stage: approvalStage,
        action: action,
        comments: comments || null,
      };
      if (initial?.id) {
        await updateApprovalHistory(userId, initial.id, payload);
      } else {
        await createApprovalHistory(userId, payload);
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
        <h2 className="text-2xl font-bold mb-4 text-white">{initial ? "Editar Historial de Aprobación" : "Nuevo Historial de Aprobación"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">ID de Solicitud</label>
            <input
              type="number"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={requestId}
              onChange={(e) => setRequestId(parseInt(e.target.value))}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Etapa de Aprobación</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={approvalStage}
              onChange={(e) => setApprovalStage(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Acción</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Comentarios</label>
            <textarea
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
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
