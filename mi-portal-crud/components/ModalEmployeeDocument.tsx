// src/components/ModalEmployeeDocument.tsx
import React, { JSX, useState, useEffect } from "react";
import { EmployeeDocument } from "../types";
import { createEmployeeDocument, updateEmployeeDocument } from "../lib/api";

interface Props {
  userId: number;
  initial?: EmployeeDocument | null;
  onClose: () => void;
}

export default function ModalEmployeeDocument({ userId, initial, onClose }: Props): JSX.Element {
  const [documentType, setDocumentType] = useState<string>("");
  const [documentName, setDocumentName] = useState<string>("");
  const [filePath, setFilePath] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>("");
  const [expirationDate, setExpirationDate] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [verifiedBy, setVerifiedBy] = useState<number | undefined>(undefined);
  const [verifiedDate, setVerifiedDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setDocumentType(initial.document_type);
      setDocumentName(initial.document_name);
      setFilePath(initial.file_path || "");
      setFileUrl(initial.file_url || "");
      setExpirationDate(initial.expiration_date || "");
      setIsVerified(initial.is_verified || false);
      setVerifiedBy(initial.verified_by || undefined);
      setVerifiedDate(initial.verified_date ? new Date(initial.verified_date).toISOString().split('T')[0] : "");
      setNotes(initial.notes || "");
    }
  }, [initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        employee_id: userId,
        document_type: documentType,
        document_name: documentName,
        file_path: filePath || null,
        file_url: fileUrl || null,
        expiration_date: expirationDate || null,
        is_verified: isVerified,
        verified_by: verifiedBy || null,
        verified_date: verifiedDate ? new Date(verifiedDate) : null,
        notes: notes || null,
      };
      if (initial?.id) {
        await updateEmployeeDocument(userId, initial.id, payload);
      } else {
        await createEmployeeDocument(userId, payload);
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
        <h2 className="text-2xl font-bold mb-4 text-white">{initial ? "Editar Documento" : "Nuevo Documento"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de Documento</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Nombre del Documento</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Ruta del Archivo</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">URL del Archivo</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Fecha de Expiración</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="isVerified"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
              checked={isVerified}
              onChange={(e) => setIsVerified(e.target.checked)}
            />
            <label htmlFor="isVerified" className="ml-2 block text-sm text-gray-300">Verificado</label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Verificado por (ID de Usuario)</label>
            <input
              type="number"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={verifiedBy || ""}
              onChange={(e) => setVerifiedBy(parseInt(e.target.value) || undefined)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Fecha de Verificación</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={verifiedDate}
              onChange={(e) => setVerifiedDate(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Notas</label>
            <textarea
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
