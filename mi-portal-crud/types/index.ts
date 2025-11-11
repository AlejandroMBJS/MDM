// src/types/index.ts
export interface Notification {
  id?: number;
  user_id: number;
  request_id?: number | null;
  message: string;
  is_read?: boolean;
  notification_type?: string | null;
  read_at?: string | null;
  created_at?: string;
}

export interface ApprovalHistory {
  id?: number;
  request_id: number;
  approver_id: number;
  approval_stage: string;
  action: string;
  comments?: string | null;
  created_at?: string;
}

export interface AbsenceRequest {
  id?: number;
  employee_id: number;
  request_type: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  status?: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "ARCHIVED";
  current_approval_stage?: string;
  hours_per_day?: number | null;
  paid_days?: number | null;
  unpaid_days?: number | null;
  unpaid_comments?: string | null;
  shift_details?: string | null;
  leave_category?: string | null;
  business_days?: number | null;
  attachment_path?: string | null;
  approved_by?: number | null;
  approved_date?: string | null;
  rejected_by?: number | null;
  rejected_date?: string | null;
  rejection_reason?: string | null;
  created_by?: number | null;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string | null;
}

export interface PayrollHistory {
  id?: number;
  employee_id: number;
  payroll_period: string;
  period_start: string;
  period_end: string;
  base_salary?: number | null;
  overtime_pay?: number;
  bonuses?: number;
  commissions?: number;
  other_income?: number;
  gross_pay?: number | null;
  isr_tax?: number;
  imss_employee?: number;
  infonavit_discount?: number;
  fonacot_discount?: number;
  other_deductions?: number;
  total_deductions?: number | null;
  net_pay?: number | null;
  payment_status?: "PENDING" | "PROCESSED" | "PAID" | "CANCELLED";
  payment_date?: string | null;
  payment_method?: string | null;
  created_at?: string;
  created_by?: number | null;
}

export interface AuditoriaHorarios {
  id?: number;
  empleado_id: number;
  fecha: string;
  hora_entrada?: string | null;
  hora_salida?: string | null;
  horas_trabajadas?: number | null; // Generated column
  estado?: "puntual" | "tarde" | "ausente" | "temprano";
  registrado_por?: number | null;
  notas?: string | null;
  created_at?: string;
  updated_at?: string | null;
}

export interface HorarioExcepcion {
  id?: number;
  empleado_id: number;
  fecha_inicio: string;
  fecha_fin: string;
  turno_id: number;
  motivo?: string | null;
  aprobado_por?: number | null;
  estado?: "pendiente" | "aprobado" | "rechazado";
  created_at?: string;
  updated_at?: string | null;
}

export interface HorarioBase {
  id?: number;
  empleado_id: number;
  turno_id: number;
  dia_semana: number;
  created_at?: string;
  updated_at?: string | null;
}

export interface EmployeeBenefit {
  id?: number;
  employee_id: number;
  benefit_type: string;
  benefit_name: string;
  provider?: string | null;
  policy_number?: string | null;
  coverage_amount?: number | null;
  start_date: string;
  end_date?: string | null;
  employee_cost?: number;
  employer_cost?: number;
  beneficiary_name?: string | null;
  is_active?: boolean;
  notes?: string | null;
  created_at?: string;
  updated_at?: string | null;
}

export interface TimeOffBalance {
  id?: number;
  employee_id: number;
  year: number;
  leave_type: string;
  total_days?: number;
  used_days?: number;
  pending_days?: number;
  available_days?: number; // Generated column
  expires_on?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string | null;
}

export interface JobHistory {
  id?: number;
  employee_id: number;
  effective_date: string;
  end_date?: string | null;
  position_title?: string | null;
  department?: string | null;
  area?: string | null;
  supervisor_id?: number | null;
  salary?: number | null;
  change_type?: string | null;
  change_reason?: string | null;
  created_by?: number | null;
  created_at?: string;
  updated_at?: string | null;
}

export interface EmployeeDocument {
  id?: number;
  employee_id: number;
  document_type: string;
  document_name: string;
  file_path?: string | null;
  file_url?: string | null;
  expiration_date?: string | null;
  is_verified?: boolean;
  verified_by?: number | null;
  verified_date?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string | null;
}

export interface Dependent {
  id?: number;
  employee_id: number;
  dependent_name: string;
  relationship: string;
  birth_date?: string | null;
  gender?: string | null;
  curp?: string | null;
  is_beneficiary?: boolean;
  beneficiary_percentage?: number | null;
  is_dependent?: boolean;
  has_disability?: boolean;
  notes?: string | null;
  created_at?: string;
  updated_at?: string | null;
}

export interface UserCreate {
  name: string;
  email: string;
  password: string;
  role?: string;
  supervisor_id?: number;
  department?: string;
  default_dashboard?: string;
  payroll_number?: string;
  periodo?: string;
  centro_u?: string;
  tipo_usuario?: string;
  area?: string;
  regimen?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  second_last_name?: string;
  personal_email?: string;
  phone_number?: string;
  mobile_number?: string;
  street_address?: string;
  address_line2?: string;
  city?: string;
  state_province?: string;
  postal_code?: string;
  country?: string;
  birth_date?: string;
  gender?: string;
  marital_status?: string;
  nationality?: string;
  curp?: string;
  rfc?: string;
  nss?: string;
  passport_number?: string;
  drivers_license?: string;
  employee_status?: string;
  hire_date?: string;
  termination_date?: string;
  termination_reason?: string;
  position_title?: string;
  job_level?: string;
  cost_center?: string;
  salary?: number;
  salary_currency?: string;
  payment_frequency?: string;
  payment_method?: string;
  bank_name?: string;
  bank_account_number?: string;
  clabe?: string;
  contract_type?: string;
  work_schedule?: string;
  is_active?: boolean;
  last_login?: string;
  infonavit_credit?: boolean;
  infonavit_number?: string;
  infonavit_discount?: number;
  fonacot_credit?: boolean;
  fonacot_number?: string;
  created_by?: number;
  updated_by?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string | null;
  supervisor_id?: number | null;
  department?: string | null;
  default_dashboard?: string | null;
  payroll_number?: string | null;
  periodo?: string | null;
  centro_u?: string | null;
  tipo_usuario?: string | null;
  area?: string | null;
  regimen?: string | null;
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
  second_last_name?: string | null;
  personal_email?: string | null;
  phone_number?: string | null;
  mobile_number?: string | null;
  street_address?: string | null;
  address_line2?: string | null;
  city?: string | null;
  state_province?: string | null;
  postal_code?: string | null;
  country?: string | null;
  birth_date?: string | null;
  gender?: string | null;
  marital_status?: string | null;
  nationality?: string | null;
  curp?: string | null;
  rfc?: string | null;
  nss?: string | null;
  passport_number?: string | null;
  drivers_license?: string | null;
  employee_status?: string | null;
  hire_date?: string | null;
  termination_date?: string | null;
  termination_reason?: string | null;
  position_title?: string | null;
  job_level?: string | null;
  cost_center?: string | null;
  salary?: number | null;
  salary_currency?: string | null;
  payment_frequency?: string | null;
  payment_method?: string | null;
  bank_name?: string | null;
  bank_account_number?: string | null;
  clabe?: string | null;
  contract_type?: string | null;
  work_schedule?: string | null;
  last_login?: string | null;
  infonavit_credit?: boolean | null;
  infonavit_number?: string | null;
  infonavit_discount?: number | null;
  fonacot_credit?: boolean | null;
  fonacot_number?: string | null;
  created_by?: number | null;
  updated_by?: number | null;
}

export interface EmergencyContact {
  id?: number;
  employee_id: number;
  contact_name: string;
  relationship: string;
  phone_number: string;
  alternative_phone?: string | null;
  email?: string | null;
  address?: string | null;
  is_primary?: boolean;
  created_at?: string;
  updated_at?: string | null;
}

export interface Turno {
  id?: number;
  nombre: string;
  codigo: string;
  hora_inicio: string;
  hora_fin: string;
  es_descanso: boolean;
  activo: boolean;
  created_at?: string;
  updated_at?: string | null;
}

export interface HorarioBase {
  id?: number;
  empleado_id: number;
  turno_id: number;
  dia_semana: number; // 0..6
  created_at?: string;
  updated_at?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}
