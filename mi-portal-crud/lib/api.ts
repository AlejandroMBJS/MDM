// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY || "mdm_token";

// ✅ Solo usar localStorage en entorno cliente
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // ✅ FIX: Corrected fetch call - removed backticks around the URL
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json();
}

/**
 * Parse JWT payload without verification (useful to get role/email).
 * Not security-critical (solo UI); la validación real la hace el backend.
 */
export function parseJwt(token: string | null): Record<string, any> | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(decoded)));
  } catch {
    return null;
  }
}

type FetchOpts = Omit<RequestInit, "headers"> & { noJson?: boolean };

async function rawFetch(path: string, opts: FetchOpts = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string> | undefined),
  };

  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...opts,
    headers,
    credentials: "omit", // cookie flow not used here
  });

  if (!res.ok) {
    let body: any = null;
    try { body = await res.json(); } catch { /* ignore */ }
    const message = body?.detail || body?.message || `HTTP ${res.status}`;
    throw new Error(message);
  }
  if (opts.noJson || res.status === 204) return null;
  return res.json();
}

/* Auth */
export async function login(email: string, password: string) {
  return rawFetch("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/* Horarios */
export async function fetchHorarios() {
  return rawFetch("/api/v1/horarios-base/?limit=500");
}

export async function createHorario(payload: { empleado_id: number; turno_id: number; dia_semana: number; }) {
  return rawFetch("/api/v1/horarios-base/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateHorario(id: number, payload: Partial<{ empleado_id: number; turno_id: number; dia_semana: number; }>) {
  return rawFetch(`/api/v1/horarios-base/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteHorario(id: number) {
  return rawFetch(`/api/v1/horarios-base/${id}`, { method: "DELETE", noJson: true });
}

/* Users (admin) */
export async function createUser(payload: { name: string; email: string; password: string; role?: string; }) {
  return rawFetch("/api/v1/users/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchUser(id: number) {
  return rawFetch(`/api/v1/users/${id}`);
}

export async function fetchUsers() {
  return rawFetch("/api/v1/users/?limit=500");
}

/* Turnos */
export async function fetchTurnos() {
  return rawFetch("/api/v1/turnos/?limit=500");
}

export async function createTurno(payload: { nombre: string; codigo: string; hora_inicio: string; hora_fin: string; es_descanso?: boolean; activo?: boolean; }) {
  return rawFetch("/api/v1/turnos/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTurno(id: number, payload: Partial<{ nombre: string; codigo: string; hora_inicio: string; hora_fin: string; es_descanso?: boolean; activo?: boolean; }>) {
  return rawFetch(`/api/v1/turnos/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteTurno(id: number) {
  return rawFetch(`/api/v1/turnos/${id}`, { method: "DELETE", noJson: true });
}

/* Emergency Contacts */
export async function fetchEmergencyContacts() {
  return rawFetch("/api/v1/emergency-contacts/?limit=500");
}

export async function createEmergencyContact(payload: { employee_id: number; contact_name: string; relationship: string; phone_number: string; alternative_phone?: string; email?: string; address?: string; is_primary?: boolean; }) {
  return rawFetch("/api/v1/emergency-contacts/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateEmergencyContact(id: number, payload: Partial<{ employee_id: number; contact_name: string; relationship: string; phone_number: string; alternative_phone?: string; email?: string; address?: string; is_primary?: boolean; }>) {
  return rawFetch(`/api/v1/emergency-contacts/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteEmergencyContact(id: number) {
  return rawFetch(`/api/v1/emergency-contacts/${id}`, { method: "DELETE", noJson: true });
}

/* Dependents */
export async function fetchDependents(userId: number) {
  return rawFetch(`/api/v1/users/${userId}/dependents/?limit=500`);
}

export async function createDependent(userId: number, payload: { employee_id: number; dependent_name: string; relationship: string; birth_date?: string; gender?: string; curp?: string; is_beneficiary?: boolean; beneficiary_percentage?: number; is_dependent?: boolean; has_disability?: boolean; notes?: string; }) {
  return rawFetch(`/api/v1/users/${userId}/dependents/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateDependent(userId: number, id: number, payload: Partial<{ employee_id: number; dependent_name: string; relationship: string; birth_date?: string; gender?: string; curp?: string; is_beneficiary?: boolean; beneficiary_percentage?: number; is_dependent?: boolean; has_disability?: boolean; notes?: string; }>) {
  return rawFetch(`/api/v1/users/${userId}/dependents/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteDependent(userId: number, id: number) {
  return rawFetch(`/api/v1/users/${userId}/dependents/${id}`, { method: "DELETE", noJson: true });
}

/* Employee Documents */
export async function fetchEmployeeDocuments(userId: number) {
  return rawFetch(`/api/v1/users/${userId}/documents/?limit=500`);
}

export async function createEmployeeDocument(userId: number, payload: { employee_id: number; document_type: string; document_name: string; file_path?: string; file_url?: string; expiration_date?: string; is_verified?: boolean; verified_by?: number; verified_date?: string; notes?: string; }) {
  return rawFetch(`/api/v1/users/${userId}/documents/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateEmployeeDocument(userId: number, id: number, payload: Partial<{ employee_id: number; document_type: string; document_name: string; file_path?: string; file_url?: string; expiration_date?: string; is_verified?: boolean; verified_by?: number; verified_date?: string; notes?: string; }>) {
  return rawFetch(`/api/v1/users/${userId}/documents/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteEmployeeDocument(userId: number, id: number) {
  return rawFetch(`/api/v1/users/${userId}/documents/${id}`, { method: "DELETE", noJson: true });
}

/* Job History */
export async function fetchJobHistory(userId: number) {
  return rawFetch(`/api/v1/users/${userId}/job-history/?limit=500`);
}

export async function createJobHistory(userId: number, payload: { employee_id: number; effective_date: string; end_date?: string; position_title?: string; department?: string; area?: string; supervisor_id?: number; salary?: number; change_type?: string; change_reason?: string; created_by?: number; }) {
  return rawFetch(`/api/v1/users/${userId}/job-history/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateJobHistory(userId: number, id: number, payload: Partial<{ employee_id: number; effective_date: string; end_date?: string; position_title?: string; department?: string; area?: string; supervisor_id?: number; salary?: number; change_type?: string; change_reason?: string; created_by?: number; }>) {
  return rawFetch(`/api/v1/users/${userId}/job-history/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteJobHistory(userId: number, id: number) {
  return rawFetch(`/api/v1/users/${userId}/job-history/${id}`, { method: "DELETE", noJson: true });
}

/* Time Off Balances */
export async function fetchTimeOffBalances(userId: number) {
  return rawFetch(`/api/v1/users/${userId}/time-off-balances/?limit=500`);
}

export async function createTimeOffBalance(userId: number, payload: { employee_id: number; year: number; leave_type: string; total_days?: number; used_days?: number; pending_days?: number; expires_on?: string; notes?: string; }) {
  return rawFetch(`/api/v1/users/${userId}/time-off-balances/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTimeOffBalance(userId: number, id: number, payload: Partial<{ employee_id: number; year: number; leave_type: string; total_days?: number; used_days?: number; pending_days?: number; expires_on?: string; notes?: string; }>) {
  return rawFetch(`/api/v1/users/${userId}/time-off-balances/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteTimeOffBalance(userId: number, id: number) {
  return rawFetch(`/api/v1/users/${userId}/time-off-balances/${id}`, { method: "DELETE", noJson: true });
}

/* Employee Benefits */
export async function fetchEmployeeBenefits(userId: number) {
  return rawFetch(`/api/v1/users/${userId}/benefits/?limit=500`);
}

export async function createEmployeeBenefit(userId: number, payload: { employee_id: number; benefit_type: string; benefit_name: string; provider?: string; policy_number?: string; coverage_amount?: number; start_date: string; end_date?: string; employee_cost?: number; employer_cost?: number; beneficiary_name?: string; is_active?: boolean; notes?: string; }) {
  return rawFetch(`/api/v1/users/${userId}/benefits/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateEmployeeBenefit(userId: number, id: number, payload: Partial<{ employee_id: number; benefit_type: string; benefit_name: string; provider?: string; policy_number?: string; coverage_amount?: number; start_date: string; end_date?: string; employee_cost?: number; employer_cost?: number; beneficiary_name?: string; is_active?: boolean; notes?: string; }>) {
  return rawFetch(`/api/v1/users/${userId}/benefits/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteEmployeeBenefit(userId: number, id: number) {
  return rawFetch(`/api/v1/users/${userId}/benefits/${id}`, { method: "DELETE", noJson: true });
}

/* Horarios Base */
export async function fetchHorariosBase(userId: number) {
  return rawFetch(`/api/v1/users/${userId}/horarios-base/?limit=500`);
}

export async function createHorarioBase(userId: number, payload: { empleado_id: number; turno_id: number; dia_semana: number; }) {
  return rawFetch(`/api/v1/users/${userId}/horarios-base/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateHorarioBase(userId: number, id: number, payload: Partial<{ empleado_id: number; turno_id: number; dia_semana: number; }>) {
  return rawFetch(`/api/v1/users/${userId}/horarios-base/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteHorarioBase(userId: number, id: number) {
  return rawFetch(`/api/v1/users/${userId}/horarios-base/${id}`, { method: "DELETE", noJson: true });
}

/* Horarios Excepcion */
export async function fetchHorariosExcepcion(userId: number) {
  return rawFetch(`/api/v1/users/${userId}/horarios-excepcion/?limit=500`);
}

export async function createHorarioExcepcion(userId: number, payload: { empleado_id: number; fecha_inicio: string; fecha_fin: string; turno_id: number; motivo?: string; aprobado_por?: number; estado?: "pendiente" | "aprobado" | "rechazado"; }) {
  return rawFetch(`/api/v1/users/${userId}/horarios-excepcion/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateHorarioExcepcion(userId: number, id: number, payload: Partial<{ empleado_id: number; fecha_inicio: string; fecha_fin: string; turno_id: number; motivo?: string; aprobado_por?: number; estado?: "pendiente" | "aprobado" | "rechazado"; }>) {
  return rawFetch(`/api/v1/users/${userId}/horarios-excepcion/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteHorarioExcepcion(userId: number, id: number) {
  return rawFetch(`/api/v1/users/${userId}/horarios-excepcion/${id}`, { method: "DELETE", noJson: true });
}

/* Auditoria Horarios */
export async function fetchAuditoriaHorarios(userId: number) {
  return rawFetch(`/api/v1/users/${userId}/auditoria-horarios/?limit=500`);
}

export async function createAuditoriaHorarios(userId: number, payload: { empleado_id: number; fecha: string; hora_entrada?: string; hora_salida?: string; estado?: "puntual" | "tarde" | "ausente" | "temprano"; registrado_por?: number; notas?: string; }) {
  return rawFetch(`/api/v1/users/${userId}/auditoria-horarios/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAuditoriaHorarios(userId: number, id: number, payload: Partial<{ empleado_id: number; fecha: string; hora_entrada?: string; hora_salida?: string; estado?: "puntual" | "tarde" | "ausente" | "temprano"; registrado_por?: number; notas?: string; }>) {
  return rawFetch(`/api/v1/users/${userId}/auditoria-horarios/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteAuditoriaHorarios(userId: number, id: number) {
  return rawFetch(`/api/v1/users/${userId}/auditoria-horarios/${id}`, { method: "DELETE", noJson: true });
}

/* Payroll History */
export async function fetchPayrollHistory(userId: number) {
  return rawFetch(`/api/v1/users/${userId}/payroll-history/?limit=500`);
}

export async function createPayrollHistory(userId: number, payload: { employee_id: number; payroll_period: string; period_start: string; period_end: string; base_salary?: number; overtime_pay?: number; bonuses?: number; commissions?: number; other_income?: number; gross_pay?: number; isr_tax?: number; imss_employee?: number; infonavit_discount?: number; fonacot_discount?: number; other_deductions?: number; total_deductions?: number; net_pay?: number; payment_status?: "PENDING" | "PROCESSED" | "PAID" | "CANCELLED"; payment_date?: string; payment_method?: string; created_by?: number; }) {
  return rawFetch(`/api/v1/users/${userId}/payroll-history/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updatePayrollHistory(userId: number, id: number, payload: Partial<{ employee_id: number; payroll_period: string; period_start: string; period_end: string; base_salary?: number; overtime_pay?: number; bonuses?: number; commissions?: number; other_income?: number; gross_pay?: number; isr_tax?: number; imss_employee?: number; infonavit_discount?: number; fonacot_discount?: number; other_deductions?: number; total_deductions?: number; net_pay?: number; payment_status?: "PENDING" | "PROCESSED" | "PAID" | "CANCELLED"; payment_date?: string; payment_method?: string; created_by?: number; }>) {
  return rawFetch(`/api/v1/users/${userId}/payroll-history/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deletePayrollHistory(userId: number, id: number) {
  return rawFetch(`/api/v1/users/${userId}/payroll-history/${id}`, { method: "DELETE", noJson: true });
}

/* Absence Requests */
export async function fetchAbsenceRequests(userId: number) {
  return rawFetch(`/api/v1/users/${userId}/absence-requests/?limit=500`);
}

export async function createAbsenceRequest(userId: number, payload: { employee_id: number; request_type: string; start_date: string; end_date: string; total_days: number; reason: string; status?: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "ARCHIVED"; current_approval_stage?: string; hours_per_day?: number; paid_days?: number; unpaid_days?: number; unpaid_comments?: string; shift_details?: string; leave_category?: string; business_days?: number; attachment_path?: string; approved_by?: number; approved_date?: string; rejected_by?: number; rejected_date?: string; rejection_reason?: string; created_by?: number; updated_by?: number; }) {
  return rawFetch(`/api/v1/users/${userId}/absence-requests/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAbsenceRequest(userId: number, id: number, payload: Partial<{ employee_id: number; request_type: string; start_date: string; end_date: string; total_days: number; reason: string; status?: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "ARCHIVED"; current_approval_stage?: string; hours_per_day?: number; paid_days?: number; unpaid_days?: number; unpaid_comments?: string; shift_details?: string; leave_category?: string; business_days?: number; attachment_path?: string; approved_by?: number; approved_date?: string; rejected_by?: number; rejected_date?: string; rejection_reason?: string; created_by?: number; updated_by?: number; }>) {
  return rawFetch(`/api/v1/users/${userId}/absence-requests/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteAbsenceRequest(userId: number, id: number) {
  return rawFetch(`/api/v1/users/${userId}/absence-requests/${id}`, { method: "DELETE", noJson: true });
}

/* Approval History */
export async function fetchApprovalHistory(userId: number) {
  return rawFetch(`/api/v1/users/${userId}/approval-history/?limit=500`);
}

export async function createApprovalHistory(userId: number, payload: { request_id: number; approver_id: number; approval_stage: string; action: string; comments?: string; }) {
  return rawFetch(`/api/v1/users/${userId}/approval-history/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateApprovalHistory(userId: number, id: number, payload: Partial<{ request_id: number; approver_id: number; approval_stage: string; action: string; comments?: string; }>) {
  return rawFetch(`/api/v1/users/${userId}/approval-history/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteApprovalHistory(userId: number, id: number) {
  return rawFetch(`/api/v1/users/${userId}/approval-history/${id}`, { method: "DELETE", noJson: true });
}

/* Notifications */
export async function fetchNotifications(userId: number) {
  return rawFetch(`/api/v1/users/${userId}/notifications/?limit=500`);
}

export async function createNotification(userId: number, payload: { user_id: number; request_id?: number; message: string; is_read?: boolean; notification_type?: string; read_at?: string; }) {
  return rawFetch(`/api/v1/users/${userId}/notifications/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateNotification(userId: number, id: number, payload: Partial<{ user_id: number; request_id?: number; message: string; is_read?: boolean; notification_type?: string; read_at?: string; }>) {
  return rawFetch(`/api/v1/users/${userId}/notifications/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteNotification(userId: number, id: number) {
  return rawFetch(`/api/v1/users/${userId}/notifications/${id}`, { method: "DELETE", noJson: true });
}

export { API_URL, TOKEN_KEY };