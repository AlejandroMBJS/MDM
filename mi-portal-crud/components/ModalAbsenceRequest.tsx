// src/components/ModalAbsenceRequest.tsx
import React, { JSX, useState, useEffect } from "react";
import { AbsenceRequest } from "../types";
import { createAbsenceRequest, updateAbsenceRequest } from "../lib/api";

interface Props {
  userId: number;
  initial?: AbsenceRequest | null;
  onClose: () => void;
}

export default function ModalAbsenceRequest({ userId, initial, onClose }: Props): JSX.Element {
  const [employeeId, setEmployeeId] = useState<number>(userId);
  const [requestType, setRequestType] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [totalDays, setTotalDays] = useState<number>(0);
  const [reason, setReason] = useState<string>("");
  const [status, setStatus] = useState<"PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "ARCHIVED">("PENDING");
  const [currentApprovalStage, setCurrentApprovalStage] = useState<string>("SUPERVISOR");
  const [hoursPerDay, setHoursPerDay] = useState<number | undefined>(undefined);
  const [paidDays, setPaidDays] = useState<number | undefined>(undefined);
  const [unpaidDays, setUnpaidDays] = useState<number | undefined>(undefined);
  const [unpaidComments, setUnpaidComments] = useState<string>("");
  const [shiftDetails, setShiftDetails] = useState<string>("");
  const [leaveCategory, setLeaveCategory] = useState<string>("");
  const [businessDays, setBusinessDays] = useState<number | undefined>(undefined);
  const [attachmentPath, setAttachmentPath] = useState<string>("");
  const [approvedBy, setApprovedBy] = useState<number | undefined>(undefined);
  const [approvedDate, setApprovedDate] = useState<string>("");
  const [rejectedBy, setRejectedBy] = useState<number | undefined>(undefined);
  const [rejectedDate, setRejectedDate] = useState<string>("");
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [createdBy, setCreatedBy] = useState<number | undefined>(undefined);
  const [updatedBy, setUpdatedBy] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setEmployeeId(initial.employee_id);
      setRequestType(initial.request_type);
      setStartDate(initial.start_date);
      setEndDate(initial.end_date);
      setTotalDays(initial.total_days);
      setReason(initial.reason);
      setStatus(initial.status || "PENDING");
      setCurrentApprovalStage(initial.current_approval_stage || "SUPERVISOR");
      setHoursPerDay(initial.hours_per_day || undefined);
      setPaidDays(initial.paid_days || undefined);
      setUnpaidDays(initial.unpaid_days || undefined);
      setUnpaidComments(initial.unpaid_comments || "");
      setShiftDetails(initial.shift_details || "");
      setLeaveCategory(initial.leave_category || "");
      setBusinessDays(initial.business_days || undefined);
      setAttachmentPath(initial.attachment_path || "");
      setApprovedBy(initial.approved_by || undefined);
      setApprovedDate(initial.approved_date ? new Date(initial.approved_date).toISOString().split('T')[0] : "");
      setRejectedBy(initial.rejected_by || undefined);
      setRejectedDate(initial.rejected_date ? new Date(initial.rejected_date).toISOString().split('T')[0] : "");
      setRejectionReason(initial.rejection_reason || "");
      setCreatedBy(initial.created_by || undefined);
      setUpdatedBy(initial.updated_by || undefined);
    }
  }, [initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        employee_id: employeeId,
        request_type: requestType,
        start_date: startDate,
        end_date: endDate,
        total_days: totalDays,
        reason: reason,
        status: status,
        current_approval_stage: currentApprovalStage,
        hours_per_day: hoursPerDay || null,
        paid_days: paidDays || null,
        unpaid_days: unpaidDays || null,
        unpaid_comments: unpaidComments || null,
        shift_details: shiftDetails || null,
        leave_category: leaveCategory || null,
        business_days: businessDays || null,
        attachment_path: attachmentPath || null,
        approved_by: approvedBy || null,
        approved_date: approvedDate ? new Date(approvedDate).toISOString() : null,
        rejected_by: rejectedBy || null,
        rejected_date: rejectedDate ? new Date(rejectedDate).toISOString() : null,
        rejection_reason: rejectionReason || null,
        created_by: createdBy || null,
        updated_by: updatedBy || null,
      };
      if (initial?.id) {
        await updateAbsenceRequest(userId, initial.id, payload);
      } else {
        await createAbsenceRequest(userId, payload);
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
        <h2 className="text-2xl font-bold mb-4 text-white">{initial ? "Editar Solicitud de Ausencia" : "Nueva Solicitud de Ausencia"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de Solicitud</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Fecha de Inicio</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Fecha de Fin</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Días Totales</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={totalDays}
              onChange={(e) => setTotalDays(parseFloat(e.target.value))}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Razón</label>
            <textarea
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Estado</label>
            <select
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={status}
              onChange={(e) => setStatus(e.target.value as "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "ARCHIVED")}
            >
              <option value="PENDING">Pendiente</option>
              <option value="APPROVED">Aprobado</option>
              <option value="REJECTED">Rechazado</option>
              <option value="CANCELLED">Cancelado</option>
              <option value="ARCHIVED">Archivado</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Etapa de Aprobación Actual</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={currentApprovalStage}
              onChange={(e) => setCurrentApprovalStage(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Horas por Día</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={hoursPerDay || ""}
              onChange={(e) => setHoursPerDay(parseFloat(e.target.value) || undefined)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Días Pagados</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={paidDays || ""}
              onChange={(e) => setPaidDays(parseFloat(e.target.value) || undefined)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Días No Pagados</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={unpaidDays || ""}
              onChange={(e) => setUnpaidDays(parseFloat(e.target.value) || undefined)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Comentarios No Pagados</label>
            <textarea
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={unpaidComments}
              onChange={(e) => setUnpaidComments(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Detalles del Turno</label>
            <textarea
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={shiftDetails}
              onChange={(e) => setShiftDetails(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Categoría de Ausencia</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={leaveCategory}
              onChange={(e) => setLeaveCategory(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Días Hábiles</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={businessDays || ""}
              onChange={(e) => setBusinessDays(parseFloat(e.target.value) || undefined)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Ruta del Archivo Adjunto</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={attachmentPath}
              onChange={(e) => setAttachmentPath(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Aprobado Por (ID de Usuario)</label>
            <input
              type="number"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={approvedBy || ""}
              onChange={(e) => setApprovedBy(parseInt(e.target.value) || undefined)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Fecha de Aprobación</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={approvedDate}
              onChange={(e) => setApprovedDate(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Rechazado Por (ID de Usuario)</label>
            <input
              type="number"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={rejectedBy || ""}
              onChange={(e) => setRejectedBy(parseInt(e.target.value) || undefined)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Fecha de Rechazo</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={rejectedDate}
              onChange={(e) => setRejectedDate(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Razón de Rechazo</label>
            <textarea
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Creado Por (ID de Usuario)</label>
            <input
              type="number"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={createdBy || ""}
              onChange={(e) => setCreatedBy(parseInt(e.target.value) || undefined)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Actualizado Por (ID de Usuario)</label>
            <input
              type="number"
              className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
              value={updatedBy || ""}
              onChange={(e) => setUpdatedBy(parseInt(e.target.value) || undefined)}
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
