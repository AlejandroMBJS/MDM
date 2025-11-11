-- schema_mariadb.sql
-- Converted from Oracle schema -> MariaDB (MySQL) compatible
-- Creates database mdm_db and all tables, indexes, constraints and initial data
-- MariaDB 11+ compatible (uses CHECK and GENERATED VIRTUAL columns)

CREATE DATABASE IF NOT EXISTS mdm_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE mdm_db;

-- ============================================================================
-- Note: Oracle sequences become AUTO_INCREMENT columns in MariaDB.
-- Timestamps use DATETIME / TIMESTAMP with DEFAULT CURRENT_TIMESTAMP.
-- ============================================================================
-- TABLE: users
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id                      INT AUTO_INCREMENT PRIMARY KEY,
    name                    VARCHAR(200) NOT NULL,
    email                   VARCHAR(200) NOT NULL UNIQUE,
    password_hash           VARCHAR(255) NOT NULL,
    role                    VARCHAR(50) NOT NULL,
    supervisor_id           INT NULL,
    department              VARCHAR(200),
    default_dashboard       VARCHAR(100),

    payroll_number          VARCHAR(50) UNIQUE,
    periodo                 VARCHAR(100),
    centro_u                VARCHAR(100),
    tipo_usuario            VARCHAR(100),
    area                    VARCHAR(200),
    regimen                 VARCHAR(100),

    first_name              VARCHAR(100),
    middle_name             VARCHAR(100),
    last_name               VARCHAR(100),
    second_last_name        VARCHAR(100),

    personal_email          VARCHAR(200),
    phone_number            VARCHAR(20),
    mobile_number           VARCHAR(20),

    street_address          VARCHAR(300),
    address_line2           VARCHAR(200),
    city                    VARCHAR(100),
    state_province          VARCHAR(100),
    postal_code             VARCHAR(20),
    country                 VARCHAR(100) DEFAULT 'México',

    birth_date              DATETIME,
    gender                  VARCHAR(20),
    marital_status          VARCHAR(50),
    nationality             VARCHAR(100),

    curp                    VARCHAR(18) UNIQUE,
    rfc                     VARCHAR(13) UNIQUE,
    nss                     VARCHAR(11) UNIQUE,
    passport_number         VARCHAR(50),
    drivers_license         VARCHAR(50),

    employee_status         VARCHAR(50) DEFAULT 'ACTIVE',
    hire_date               DATETIME,
    termination_date        DATETIME,
    termination_reason      VARCHAR(500),

    position_title          VARCHAR(200),
    job_level               VARCHAR(50),
    cost_center             VARCHAR(100),

    salary                  DECIMAL(12,2),
    salary_currency         VARCHAR(10) DEFAULT 'MXN',
    payment_frequency       VARCHAR(50),
    payment_method          VARCHAR(50),
    bank_name               VARCHAR(100),
    bank_account_number     VARCHAR(50),
    clabe                   VARCHAR(18),

    contract_type           VARCHAR(100),
    work_schedule           VARCHAR(100),

    is_active               TINYINT(1) DEFAULT 1,
    last_login              DATETIME,

    infonavit_credit        TINYINT(1) DEFAULT 0,
    infonavit_number        VARCHAR(50),
    infonavit_discount      DECIMAL(10,2),
    fonacot_credit          TINYINT(1) DEFAULT 0,
    fonacot_number          VARCHAR(50),

    created_at              DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at              DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by              INT,
    updated_by              INT,

    CONSTRAINT chk_users_employee_status CHECK (employee_status IN ('ACTIVE','INACTIVE','SUSPENDED','TERMINATED','ON_LEAVE')),
    CONSTRAINT chk_users_gender CHECK (gender IN ('M','F','O','PREFER_NOT_TO_SAY')),
    CONSTRAINT chk_users_is_active CHECK (is_active IN (0,1)),
    INDEX idx_users_email (email),
    INDEX idx_users_payroll (payroll_number),
    INDEX idx_users_nss (nss),
    INDEX idx_users_rfc (rfc),
    INDEX idx_users_curp (curp),
    INDEX idx_users_department (department),
    INDEX idx_users_supervisor (supervisor_id),
    INDEX idx_users_status (employee_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE users
  ADD CONSTRAINT fk_users_supervisor FOREIGN KEY (supervisor_id) REFERENCES users(id) ON DELETE SET NULL;

-- Add comments via ALTER (MySQL supports column comments; optional)
ALTER TABLE users MODIFY COLUMN curp VARCHAR(18) COMMENT 'Clave Única de Registro de Población';
ALTER TABLE users MODIFY COLUMN rfc VARCHAR(13) COMMENT 'Registro Federal de Contribuyentes';
ALTER TABLE users MODIFY COLUMN nss VARCHAR(11) COMMENT 'Número de Seguridad Social IMSS';
ALTER TABLE users MODIFY COLUMN clabe VARCHAR(18) COMMENT 'Clave Bancaria Estandarizada';

-- ============================================================================
-- TABLE: emergency_contacts
-- ============================================================================
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    employee_id         INT NOT NULL,
    relationship_type   VARCHAR(100) NOT NULL,
    phone_number        VARCHAR(20) NOT NULL,
    alternative_phone   VARCHAR(20),
    email               VARCHAR(200),
    address             VARCHAR(500),
    is_primary          TINYINT(1) DEFAULT 0,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_emergency_employee (employee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE emergency_contacts
  ADD CONSTRAINT fk_emergency_employee FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
  ADD CONSTRAINT chk_emergency_primary CHECK (is_primary IN (0,1));

-- ============================================================================
-- TABLE: dependents
-- ============================================================================
CREATE TABLE IF NOT EXISTS dependents (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    employee_id         INT NOT NULL,
    dependent_name      VARCHAR(200) NOT NULL,
    relationship_type   VARCHAR(100) NOT NULL,
    birth_date          DATETIME,
    gender              VARCHAR(20),
    curp                VARCHAR(18),
    is_beneficiary      TINYINT(1) DEFAULT 0,
    beneficiary_percentage DECIMAL(5,2),
    is_dependent        TINYINT(1) DEFAULT 1,
    has_disability      TINYINT(1) DEFAULT 0,
    notes               VARCHAR(500),
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_dependents_employee (employee_id),
    CONSTRAINT chk_dependent_beneficiary CHECK (is_beneficiary IN (0,1)),
    CONSTRAINT chk_dependent_is_dependent CHECK (is_dependent IN (0,1)),
    CONSTRAINT chk_dependent_disability CHECK (has_disability IN (0,1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE dependents
  ADD CONSTRAINT fk_dependent_employee FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE;

-- ============================================================================
-- TABLE: employee_documents
-- ============================================================================
CREATE TABLE IF NOT EXISTS employee_documents (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    employee_id         INT NOT NULL,
    document_type       VARCHAR(100) NOT NULL,
    document_name       VARCHAR(200) NOT NULL,
    file_path           VARCHAR(500),
    file_url            VARCHAR(500),
    expiration_date     DATETIME,
    is_verified         TINYINT(1) DEFAULT 0,
    verified_by         INT,
    verified_date       DATETIME,
    notes               VARCHAR(500),
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_documents_employee (employee_id),
    INDEX idx_documents_type (document_type),
    CONSTRAINT chk_document_verified CHECK (is_verified IN (0,1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE employee_documents
  ADD CONSTRAINT fk_document_employee FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_document_verified_by FOREIGN KEY (verified_by) REFERENCES users(id);

-- ============================================================================
-- TABLE: job_history
-- ============================================================================
CREATE TABLE IF NOT EXISTS job_history (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    employee_id         INT NOT NULL,
    effective_date      DATETIME NOT NULL,
    end_date            DATETIME,
    position_title      VARCHAR(200),
    department          VARCHAR(200),
    area                VARCHAR(200),
    supervisor_id       INT,
    salary              DECIMAL(12,2),
    change_type         VARCHAR(50),
    change_reason       VARCHAR(500),
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by          INT,
    INDEX idx_job_history_employee (employee_id),
    INDEX idx_job_history_dates (effective_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE job_history
  ADD CONSTRAINT fk_job_history_employee FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_job_history_supervisor FOREIGN KEY (supervisor_id) REFERENCES users(id),
  ADD CONSTRAINT fk_job_history_created_by FOREIGN KEY (created_by) REFERENCES users(id);

-- ============================================================================
-- TABLE: time_off_balances
-- ============================================================================
CREATE TABLE IF NOT EXISTS time_off_balances (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    employee_id         INT NOT NULL,
    year                INT NOT NULL,
    leave_type          VARCHAR(50) NOT NULL,
    total_days          DECIMAL(8,2) NOT NULL DEFAULT 0,
    used_days           DECIMAL(8,2) DEFAULT 0,
    pending_days        DECIMAL(8,2) DEFAULT 0,
    available_days      DECIMAL(8,2) AS (total_days - used_days - pending_days) VIRTUAL,
    expires_on          DATETIME,
    notes               VARCHAR(500),
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_balance_employee (employee_id),
    CONSTRAINT uk_balance_employee_year_type UNIQUE (employee_id, year, leave_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE time_off_balances
  ADD CONSTRAINT fk_balance_employee FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE;

-- ============================================================================
-- TABLE: employee_benefits
-- ============================================================================
CREATE TABLE IF NOT EXISTS employee_benefits (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    employee_id         INT NOT NULL,
    benefit_type        VARCHAR(100) NOT NULL,
    benefit_name        VARCHAR(200) NOT NULL,
    provider            VARCHAR(200),
    policy_number       VARCHAR(100),
    coverage_amount     DECIMAL(12,2),
    start_date          DATETIME NOT NULL,
    end_date            DATETIME,
    employee_cost       DECIMAL(10,2) DEFAULT 0,
    employer_cost       DECIMAL(10,2) DEFAULT 0,
    beneficiary_name    VARCHAR(200),
    is_active           TINYINT(1) DEFAULT 1,
    notes               VARCHAR(500),
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_benefits_employee (employee_id),
    INDEX idx_benefits_type (benefit_type),
    CONSTRAINT chk_benefit_active CHECK (is_active IN (0,1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE employee_benefits
  ADD CONSTRAINT fk_benefit_employee FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE;

-- ============================================================================
-- TABLE: absence_requests
-- ============================================================================
CREATE TABLE IF NOT EXISTS absence_requests (
    id                          INT AUTO_INCREMENT PRIMARY KEY,
    employee_id                 INT NOT NULL,
    request_type                VARCHAR(100) NOT NULL,
    start_date                  DATETIME NOT NULL,
    end_date                    DATETIME NOT NULL,
    total_days                  DECIMAL(8,2) NOT NULL,
    reason                      VARCHAR(2000) NOT NULL,
    status                      VARCHAR(50) DEFAULT 'PENDING',
    current_approval_stage      VARCHAR(50) DEFAULT 'SUPERVISOR',
    hours_per_day               DECIMAL(5,2),
    paid_days                   DECIMAL(8,2),
    unpaid_days                 DECIMAL(8,2),
    unpaid_comments             VARCHAR(500),
    shift_details               VARCHAR(500),
    created_at                  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at                  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    leave_category              VARCHAR(100),
    business_days               DECIMAL(8,2),
    attachment_path             VARCHAR(500),
    approved_by                 INT,
    approved_date               DATETIME,
    rejected_by                 INT,
    rejected_date               DATETIME,
    rejection_reason            VARCHAR(1000),
    created_by                  INT,
    updated_by                  INT,
    INDEX idx_absence_employee (employee_id),
    INDEX idx_absence_status (status),
    INDEX idx_absence_dates (start_date, end_date),
    CONSTRAINT chk_absence_status CHECK (status IN ('PENDING','APPROVED','REJECTED','CANCELLED','ARCHIVED')),
    CONSTRAINT chk_absence_dates CHECK (end_date >= start_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE absence_requests
  ADD CONSTRAINT fk_absence_employee FOREIGN KEY (employee_id) REFERENCES users(id),
  ADD CONSTRAINT fk_absence_approved_by FOREIGN KEY (approved_by) REFERENCES users(id),
  ADD CONSTRAINT fk_absence_rejected_by FOREIGN KEY (rejected_by) REFERENCES users(id);

-- ============================================================================
-- TABLE: approval_history
-- ============================================================================
CREATE TABLE IF NOT EXISTS approval_history (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    request_id          INT NOT NULL,
    approver_id         INT NOT NULL,
    approval_stage      VARCHAR(50) NOT NULL,
    action              VARCHAR(50) NOT NULL,
    comments            VARCHAR(1000),
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_approval_request (request_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE approval_history
  ADD CONSTRAINT fk_approval_request FOREIGN KEY (request_id) REFERENCES absence_requests(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_approval_approver FOREIGN KEY (approver_id) REFERENCES users(id);

-- ============================================================================
-- TABLE: notifications
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    user_id             INT NOT NULL,
    request_id          INT,
    message             VARCHAR(1000) NOT NULL,
    is_read             TINYINT(1) DEFAULT 0,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    notification_type   VARCHAR(50),
    read_at             DATETIME,
    INDEX idx_notifications_user (user_id),
    INDEX idx_notifications_read (is_read),
    CONSTRAINT chk_notification_read CHECK (is_read IN (0,1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE notifications
  ADD CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_notification_request FOREIGN KEY (request_id) REFERENCES absence_requests(id) ON DELETE CASCADE;

-- ============================================================================
-- TABLE: turnos
-- ============================================================================
CREATE TABLE IF NOT EXISTS turnos (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    nombre              VARCHAR(200) NOT NULL,
    codigo              VARCHAR(50) NOT NULL UNIQUE,
    hora_inicio         VARCHAR(10) NOT NULL,
    hora_fin            VARCHAR(10) NOT NULL,
    es_descanso         TINYINT(1) DEFAULT 0,
    activo              TINYINT(1) DEFAULT 1,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_turno_descanso CHECK (es_descanso IN (0,1)),
    CONSTRAINT chk_turno_activo CHECK (activo IN (0,1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE INDEX idx_turnos_codigo ON turnos(codigo);

-- ============================================================================
-- TABLE: horarios_base
-- ============================================================================
CREATE TABLE IF NOT EXISTS horarios_base (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    empleado_id         INT NOT NULL,
    turno_id            INT NOT NULL,
    dia_semana          TINYINT NOT NULL,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_horario_empleado (empleado_id),
    CONSTRAINT uk_horario_empleado_dia UNIQUE (empleado_id, dia_semana),
    CONSTRAINT chk_horario_dia_semana CHECK (dia_semana BETWEEN 0 AND 6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE horarios_base
  ADD CONSTRAINT fk_horario_empleado FOREIGN KEY (empleado_id) REFERENCES users(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_horario_turno FOREIGN KEY (turno_id) REFERENCES turnos(id);

-- ============================================================================
-- TABLE: horarios_excepcion
-- ============================================================================
CREATE TABLE IF NOT EXISTS horarios_excepcion (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    empleado_id         INT NOT NULL,
    fecha               DATETIME NOT NULL,
    turno_id            INT NOT NULL,
    creado_por          INT NOT NULL,
    creado_en           DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_excepcion_empleado_fecha (empleado_id, fecha),
    CONSTRAINT uk_excepcion_empleado_fecha UNIQUE (empleado_id, fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE horarios_excepcion
  ADD CONSTRAINT fk_excepcion_empleado FOREIGN KEY (empleado_id) REFERENCES users(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_excepcion_turno FOREIGN KEY (turno_id) REFERENCES turnos(id),
  ADD CONSTRAINT fk_excepcion_creado_por FOREIGN KEY (creado_por) REFERENCES users(id);

-- ============================================================================
-- TABLE: auditoria_horarios
-- ============================================================================
CREATE TABLE IF NOT EXISTS auditoria_horarios (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    empleado_id         INT NOT NULL,
    fecha               DATETIME NOT NULL,
    turno_anterior_id   INT,
    turno_nuevo_id      INT NOT NULL,
    modificado_por      INT NOT NULL,
    modificado_en       DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    comentario          VARCHAR(500),
    INDEX idx_auditoria_empleado (empleado_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE auditoria_horarios
  ADD CONSTRAINT fk_auditoria_empleado FOREIGN KEY (empleado_id) REFERENCES users(id),
  ADD CONSTRAINT fk_auditoria_turno_ant FOREIGN KEY (turno_anterior_id) REFERENCES turnos(id),
  ADD CONSTRAINT fk_auditoria_turno_nvo FOREIGN KEY (turno_nuevo_id) REFERENCES turnos(id),
  ADD CONSTRAINT fk_auditoria_modificado FOREIGN KEY (modificado_por) REFERENCES users(id);

-- ============================================================================
-- TABLE: payroll_history
-- ============================================================================
CREATE TABLE IF NOT EXISTS payroll_history (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    employee_id         INT NOT NULL,
    payroll_period      VARCHAR(50) NOT NULL,
    period_start        DATETIME NOT NULL,
    period_end          DATETIME NOT NULL,
    base_salary         DECIMAL(12,2),
    overtime_pay        DECIMAL(12,2) DEFAULT 0,
    bonuses             DECIMAL(12,2) DEFAULT 0,
    commissions         DECIMAL(12,2) DEFAULT 0,
    other_income        DECIMAL(12,2) DEFAULT 0,
    gross_pay           DECIMAL(12,2),
    isr_tax             DECIMAL(12,2) DEFAULT 0,
    imss_employee       DECIMAL(12,2) DEFAULT 0,
    infonavit_discount  DECIMAL(12,2) DEFAULT 0,
    fonacot_discount    DECIMAL(12,2) DEFAULT 0,
    other_deductions    DECIMAL(12,2) DEFAULT 0,
    total_deductions    DECIMAL(12,2),
    net_pay             DECIMAL(12,2),
    payment_status      VARCHAR(50) DEFAULT 'PENDING',
    payment_date        DATETIME,
    payment_method      VARCHAR(50),
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by          INT,
    INDEX idx_payroll_employee (employee_id),
    INDEX idx_payroll_period (payroll_period),
    CONSTRAINT chk_payroll_status CHECK (payment_status IN ('PENDING','PROCESSED','PAID','CANCELLED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE payroll_history
  ADD CONSTRAINT fk_payroll_employee FOREIGN KEY (employee_id) REFERENCES users(id),
  ADD CONSTRAINT fk_payroll_created_by FOREIGN KEY (created_by) REFERENCES users(id);

-- ============================================================================
-- INITIAL DATA - turnos
-- ============================================================================
INSERT INTO turnos (nombre, codigo, hora_inicio, hora_fin, es_descanso, activo)
VALUES ('Primer Turno', '0700_1500', '07:00', '15:00', 0, 1);

INSERT INTO turnos (nombre, codigo, hora_inicio, hora_fin, es_descanso, activo)
VALUES ('Segundo Turno', '1500_2300', '15:00', '23:00', 0, 1);

INSERT INTO turnos (nombre, codigo, hora_inicio, hora_fin, es_descanso, activo)
VALUES ('Turno Nocturno', '2300_0700', '23:00', '07:00', 0, 1);

INSERT INTO turnos (nombre, codigo, hora_inicio, hora_fin, es_descanso, activo)
VALUES ('Oficina', '0900_1800', '09:00', '18:00', 0, 1);

INSERT INTO turnos (nombre, codigo, hora_inicio, hora_fin, es_descanso, activo)
VALUES ('Descanso', 'DESCANSO', '00:00', '00:00', 1, 1);

COMMIT;
