-- ============================================================================
-- ORACLE DATABASE MIGRATION SCRIPT
-- HR Information System
-- ============================================================================

SET DEFINE OFF;
ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY-MM-DD HH24:MI:SS';

-- ============================================================================
-- SEQUENCES (SQLite AUTOINCREMENT replacement)
-- ============================================================================

CREATE SEQUENCE seq_users START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_absence_requests START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_approval_history START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_notifications START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_turnos START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_horarios_base START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_horarios_excepcion START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_auditoria_horarios START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_employee_documents START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_emergency_contacts START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_dependents START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_employee_benefits START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_time_off_balances START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_payroll_history START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_job_history START WITH 1 INCREMENT BY 1 NOCACHE;

-- ============================================================================
-- TABLE: users
-- ============================================================================

CREATE TABLE users (
    id                      NUMBER(10) PRIMARY KEY,
    
    -- Basic information (existing fields - DO NOT CHANGE)
    name                    VARCHAR2(200) NOT NULL,
    email                   VARCHAR2(200) NOT NULL UNIQUE,
    password                VARCHAR2(255) NOT NULL,
    role                    VARCHAR2(50) NOT NULL,
    supervisor_id           NUMBER(10),
    department              VARCHAR2(200),
    default_dashboard       VARCHAR2(100),
    
    -- Existing custom fields (DO NOT CHANGE)
    payroll_number          VARCHAR2(50) UNIQUE,
    periodo                 VARCHAR2(100),
    centro_u                VARCHAR2(100),
    tipo_usuario            VARCHAR2(100),
    area                    VARCHAR2(200),
    regimen                 VARCHAR2(100),
    
    -- Additional personal information
    first_name              VARCHAR2(100),
    middle_name             VARCHAR2(100),
    last_name               VARCHAR2(100),
    second_last_name        VARCHAR2(100),
    
    -- Contact information
    personal_email          VARCHAR2(200),
    phone_number            VARCHAR2(20),
    mobile_number           VARCHAR2(20),
    
    -- Address
    street_address          VARCHAR2(300),
    address_line2           VARCHAR2(200),
    city                    VARCHAR2(100),
    state_province          VARCHAR2(100),
    postal_code             VARCHAR2(20),
    country                 VARCHAR2(100) DEFAULT 'México',
    
    -- Personal data
    birth_date              DATE,
    gender                  VARCHAR2(20),
    marital_status          VARCHAR2(50),
    nationality             VARCHAR2(100),
    
    -- Official IDs (Mexico)
    curp                    VARCHAR2(18) UNIQUE,
    rfc                     VARCHAR2(13) UNIQUE,
    nss                     VARCHAR2(11) UNIQUE,
    passport_number         VARCHAR2(50),
    drivers_license         VARCHAR2(50),
    
    -- Employment information
    employee_status         VARCHAR2(50) DEFAULT 'ACTIVE',
    hire_date               DATE,
    termination_date        DATE,
    termination_reason      VARCHAR2(500),
    
    -- Position details
    position_title          VARCHAR2(200),
    job_level               VARCHAR2(50),
    cost_center             VARCHAR2(100),
    
    -- Compensation
    salary                  NUMBER(12, 2),
    salary_currency         VARCHAR2(10) DEFAULT 'MXN',
    payment_frequency       VARCHAR2(50),
    payment_method          VARCHAR2(50),
    bank_name               VARCHAR2(100),
    bank_account_number     VARCHAR2(50),
    clabe                   VARCHAR2(18),
    
    -- Contract type
    contract_type           VARCHAR2(100),
    work_schedule           VARCHAR2(100),
    
    -- System
    is_active               NUMBER(1) DEFAULT 1,
    last_login              TIMESTAMP,
    
    -- Benefits
    infonavit_credit        NUMBER(1) DEFAULT 0,
    infonavit_number        VARCHAR2(50),
    infonavit_discount      NUMBER(10, 2),
    fonacot_credit          NUMBER(1) DEFAULT 0,
    fonacot_number          VARCHAR2(50),
    
    -- Audit fields (existing - DO NOT CHANGE)
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by              NUMBER(10),
    updated_by              NUMBER(10),
    
    CONSTRAINT fk_users_supervisor FOREIGN KEY (supervisor_id) REFERENCES users(id),
    CONSTRAINT chk_employee_status CHECK (employee_status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'TERMINATED', 'ON_LEAVE')),
    CONSTRAINT chk_gender CHECK (gender IN ('M', 'F', 'O', 'PREFER_NOT_TO_SAY')),
    CONSTRAINT chk_is_active CHECK (is_active IN (0, 1))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_payroll ON users(payroll_number);
CREATE INDEX idx_users_nss ON users(nss);
CREATE INDEX idx_users_rfc ON users(rfc);
CREATE INDEX idx_users_curp ON users(curp);
CREATE INDEX idx_users_department ON users(department);
CREATE INDEX idx_users_supervisor ON users(supervisor_id);
CREATE INDEX idx_users_status ON users(employee_status);

COMMENT ON COLUMN users.curp IS 'Clave Única de Registro de Población';
COMMENT ON COLUMN users.rfc IS 'Registro Federal de Contribuyentes';
COMMENT ON COLUMN users.nss IS 'Número de Seguridad Social IMSS';
COMMENT ON COLUMN users.clabe IS 'Clave Bancaria Estandarizada';

-- ============================================================================
-- TABLE: emergency_contacts
-- ============================================================================

CREATE TABLE emergency_contacts (
    id                  NUMBER(10) PRIMARY KEY,
    employee_id         NUMBER(10) NOT NULL,
    contact_name        VARCHAR2(200) NOT NULL,
    relationship        VARCHAR2(100) NOT NULL,
    phone_number        VARCHAR2(20) NOT NULL,
    alternative_phone   VARCHAR2(20),
    email               VARCHAR2(200),
    address             VARCHAR2(500),
    is_primary          NUMBER(1) DEFAULT 0,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_emergency_employee FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_emergency_primary CHECK (is_primary IN (0, 1))
);

CREATE INDEX idx_emergency_employee ON emergency_contacts(employee_id);

-- ============================================================================
-- TABLE: dependents
-- ============================================================================

CREATE TABLE dependents (
    id                  NUMBER(10) PRIMARY KEY,
    employee_id         NUMBER(10) NOT NULL,
    dependent_name      VARCHAR2(200) NOT NULL,
    relationship        VARCHAR2(100) NOT NULL,
    birth_date          DATE,
    gender              VARCHAR2(20),
    curp                VARCHAR2(18),
    is_beneficiary      NUMBER(1) DEFAULT 0,
    beneficiary_percentage NUMBER(5, 2),
    is_dependent        NUMBER(1) DEFAULT 1,
    has_disability      NUMBER(1) DEFAULT 0,
    notes               VARCHAR2(500),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_dependent_employee FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_dependent_beneficiary CHECK (is_beneficiary IN (0, 1)),
    CONSTRAINT chk_dependent_is_dependent CHECK (is_dependent IN (0, 1)),
    CONSTRAINT chk_dependent_disability CHECK (has_disability IN (0, 1))
);

CREATE INDEX idx_dependents_employee ON dependents(employee_id);

-- ============================================================================
-- TABLE: employee_documents
-- ============================================================================

CREATE TABLE employee_documents (
    id                  NUMBER(10) PRIMARY KEY,
    employee_id         NUMBER(10) NOT NULL,
    document_type       VARCHAR2(100) NOT NULL,
    document_name       VARCHAR2(200) NOT NULL,
    file_path           VARCHAR2(500),
    file_url            VARCHAR2(500),
    expiration_date     DATE,
    is_verified         NUMBER(1) DEFAULT 0,
    verified_by         NUMBER(10),
    verified_date       TIMESTAMP,
    notes               VARCHAR2(500),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_document_employee FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_document_verified_by FOREIGN KEY (verified_by) REFERENCES users(id),
    CONSTRAINT chk_document_verified CHECK (is_verified IN (0, 1))
);

CREATE INDEX idx_documents_employee ON employee_documents(employee_id);
CREATE INDEX idx_documents_type ON employee_documents(document_type);

-- ============================================================================
-- TABLE: job_history
-- ============================================================================

CREATE TABLE job_history (
    id                  NUMBER(10) PRIMARY KEY,
    employee_id         NUMBER(10) NOT NULL,
    effective_date      DATE NOT NULL,
    end_date            DATE,
    position_title      VARCHAR2(200),
    department          VARCHAR2(200),
    area                VARCHAR2(200),
    supervisor_id       NUMBER(10),
    salary              NUMBER(12, 2),
    change_type         VARCHAR2(50),
    change_reason       VARCHAR2(500),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by          NUMBER(10),
    
    CONSTRAINT fk_job_history_employee FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_job_history_supervisor FOREIGN KEY (supervisor_id) REFERENCES users(id),
    CONSTRAINT fk_job_history_created_by FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX idx_job_history_employee ON job_history(employee_id);
CREATE INDEX idx_job_history_dates ON job_history(effective_date, end_date);

-- ============================================================================
-- TABLE: time_off_balances
-- ============================================================================

CREATE TABLE time_off_balances (
    id                  NUMBER(10) PRIMARY KEY,
    employee_id         NUMBER(10) NOT NULL,
    year                NUMBER(4) NOT NULL,
    leave_type          VARCHAR2(50) NOT NULL,
    total_days          NUMBER(8, 2) NOT NULL DEFAULT 0,
    used_days           NUMBER(8, 2) DEFAULT 0,
    pending_days        NUMBER(8, 2) DEFAULT 0,
    available_days      NUMBER(8, 2) GENERATED ALWAYS AS (total_days - used_days - pending_days) VIRTUAL,
    expires_on          DATE,
    notes               VARCHAR2(500),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_balance_employee FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_balance_employee_year_type UNIQUE (employee_id, year, leave_type)
);

CREATE INDEX idx_balance_employee ON time_off_balances(employee_id);

-- ============================================================================
-- TABLE: employee_benefits
-- ============================================================================

CREATE TABLE employee_benefits (
    id                  NUMBER(10) PRIMARY KEY,
    employee_id         NUMBER(10) NOT NULL,
    benefit_type        VARCHAR2(100) NOT NULL,
    benefit_name        VARCHAR2(200) NOT NULL,
    provider            VARCHAR2(200),
    policy_number       VARCHAR2(100),
    coverage_amount     NUMBER(12, 2),
    start_date          DATE NOT NULL,
    end_date            DATE,
    employee_cost       NUMBER(10, 2) DEFAULT 0,
    employer_cost       NUMBER(10, 2) DEFAULT 0,
    beneficiary_name    VARCHAR2(200),
    is_active           NUMBER(1) DEFAULT 1,
    notes               VARCHAR2(500),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_benefit_employee FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_benefit_active CHECK (is_active IN (0, 1))
);

CREATE INDEX idx_benefits_employee ON employee_benefits(employee_id);
CREATE INDEX idx_benefits_type ON employee_benefits(benefit_type);

-- ============================================================================
-- TABLE: absence_requests (existing fields preserved - DO NOT CHANGE)
-- ============================================================================

CREATE TABLE absence_requests (
    id                          NUMBER(10) PRIMARY KEY,
    employee_id                 NUMBER(10) NOT NULL,
    request_type                VARCHAR2(100) NOT NULL,
    start_date                  DATE NOT NULL,
    end_date                    DATE NOT NULL,
    total_days                  NUMBER(8, 2) NOT NULL,
    reason                      VARCHAR2(2000) NOT NULL,
    status                      VARCHAR2(50) DEFAULT 'PENDING',
    current_approval_stage      VARCHAR2(50) DEFAULT 'SUPERVISOR',
    hours_per_day               NUMBER(5, 2),
    paid_days                   NUMBER(8, 2),
    unpaid_days                 NUMBER(8, 2),
    unpaid_comments             VARCHAR2(500),
    shift_details               VARCHAR2(500),
    created_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Additional fields
    leave_category              VARCHAR2(100),
    business_days               NUMBER(8, 2),
    attachment_path             VARCHAR2(500),
    approved_by                 NUMBER(10),
    approved_date               TIMESTAMP,
    rejected_by                 NUMBER(10),
    rejected_date               TIMESTAMP,
    rejection_reason            VARCHAR2(1000),
    created_by                  NUMBER(10),
    updated_by                  NUMBER(10),
    
    CONSTRAINT fk_absence_employee FOREIGN KEY (employee_id) REFERENCES users(id),
    CONSTRAINT fk_absence_approved_by FOREIGN KEY (approved_by) REFERENCES users(id),
    CONSTRAINT fk_absence_rejected_by FOREIGN KEY (rejected_by) REFERENCES users(id),
    CONSTRAINT chk_absence_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'ARCHIVED')),
    CONSTRAINT chk_absence_dates CHECK (end_date >= start_date)
);

CREATE INDEX idx_absence_employee ON absence_requests(employee_id);
CREATE INDEX idx_absence_status ON absence_requests(status);
CREATE INDEX idx_absence_dates ON absence_requests(start_date, end_date);

-- ============================================================================
-- TABLE: approval_history (existing - DO NOT CHANGE)
-- ============================================================================

CREATE TABLE approval_history (

    id                  NUMBER(10) PRIMARY KEY,

    request_id          NUMBER(10) NOT NULL,

    approver_id         NUMBER(10) NOT NULL,

    approval_stage      VARCHAR2(50) NOT NULL,

    action              VARCHAR2(50) NOT NULL,

    comments            VARCHAR2(1000),

    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    

    CONSTRAINT fk_approval_request FOREIGN KEY (request_id) REFERENCES absence_requests(id) ON DELETE CASCADE,

    CONSTRAINT fk_approval_approver FOREIGN KEY (approver_id) REFERENCES users(id)

);



CREATE INDEX idx_approval_request ON approval_history(request_id);



-- ============================================================================

-- TABLE: notifications (existing - DO NOT CHANGE)

-- ============================================================================



CREATE TABLE notifications (

    id                  NUMBER(10) PRIMARY KEY,

    user_id             NUMBER(10) NOT NULL,

    request_id          NUMBER(10),

    message             VARCHAR2(1000) NOT NULL,

    is_read             NUMBER(1) DEFAULT 0,

    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    

    -- Additional fields

    notification_type   VARCHAR2(50),

    read_at             TIMESTAMP,

    

    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    CONSTRAINT fk_notification_request FOREIGN KEY (request_id) REFERENCES absence_requests(id) ON DELETE CASCADE,

    CONSTRAINT chk_notification_read CHECK (is_read IN (0, 1))

);



CREATE INDEX idx_notifications_user ON notifications(user_id);

CREATE INDEX idx_notifications_read ON notifications(is_read);



-- ============================================================================

-- TABLE: turnos (existing - DO NOT CHANGE)

-- ============================================================================



CREATE TABLE turnos (

    id                  NUMBER(10) PRIMARY KEY,

    nombre              VARCHAR2(200) NOT NULL,

    codigo              VARCHAR2(50) NOT NULL UNIQUE,

    hora_inicio         VARCHAR2(10) NOT NULL,

    hora_fin            VARCHAR2(10) NOT NULL,

    es_descanso         NUMBER(1) DEFAULT 0,

    activo              NUMBER(1) DEFAULT 1,

    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    

    CONSTRAINT chk_turno_descanso CHECK (es_descanso IN (0, 1)),

    CONSTRAINT chk_turno_activo CHECK (activo IN (0, 1))

);



CREATE INDEX idx_turnos_codigo ON turnos(codigo);



-- ============================================================================

-- TABLE: horarios_base (existing - DO NOT CHANGE)

-- ============================================================================



CREATE TABLE horarios_base (

    id                  NUMBER(10) PRIMARY KEY,

    empleado_id         NUMBER(10) NOT NULL,

    turno_id            NUMBER(10) NOT NULL,

    dia_semana          NUMBER(1) NOT NULL,

    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    

    CONSTRAINT fk_horario_empleado FOREIGN KEY (empleado_id) REFERENCES users(id) ON DELETE CASCADE,

    CONSTRAINT fk_horario_turno FOREIGN KEY (turno_id) REFERENCES turnos(id),

    CONSTRAINT uk_horario_empleado_dia UNIQUE (empleado_id, dia_semana),

    CONSTRAINT chk_horario_dia_semana CHECK (dia_semana BETWEEN 0 AND 6)

);



CREATE INDEX idx_horario_empleado ON horarios_base(empleado_id);



-- ============================================================================

-- TABLE: horarios_excepcion (existing - DO NOT CHANGE)

-- ============================================================================



CREATE TABLE horarios_excepcion (

    id                  NUMBER(10) PRIMARY KEY,

    empleado_id         NUMBER(10) NOT NULL,

    fecha               DATE NOT NULL,

    turno_id            NUMBER(10) NOT NULL,

    creado_por          NUMBER(10) NOT NULL,

    creado_en           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    

    CONSTRAINT fk_excepcion_empleado FOREIGN KEY (empleado_id) REFERENCES users(id) ON DELETE CASCADE,

    CONSTRAINT fk_excepcion_turno FOREIGN KEY (turno_id) REFERENCES turnos(id),

    CONSTRAINT fk_excepcion_creado_por FOREIGN KEY (creado_por) REFERENCES users(id),

    CONSTRAINT uk_excepcion_empleado_fecha UNIQUE (empleado_id, fecha)

);



CREATE INDEX idx_excepcion_empleado_fecha ON horarios_excepcion(empleado_id, fecha);



-- ============================================================================

-- TABLE: auditoria_horarios (existing - DO NOT CHANGE)

-- ============================================================================



CREATE TABLE auditoria_horarios (

    id                  NUMBER(10) PRIMARY KEY,

    empleado_id         NUMBER(10) NOT NULL,

    fecha               DATE NOT NULL,

    turno_anterior_id   NUMBER(10),

    turno_nuevo_id      NUMBER(10) NOT NULL,

    modificado_por      NUMBER(10) NOT NULL,

    modificado_en       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    comentario          VARCHAR2(500),

    

    CONSTRAINT fk_auditoria_empleado FOREIGN KEY (empleado_id) REFERENCES users(id),

    CONSTRAINT fk_auditoria_turno_ant FOREIGN KEY (turno_anterior_id) REFERENCES turnos(id),

    CONSTRAINT fk_auditoria_turno_nvo FOREIGN KEY (turno_nuevo_id) REFERENCES turnos(id),

    CONSTRAINT fk_auditoria_modificado FOREIGN KEY (modificado_por) REFERENCES users(id)

);



CREATE INDEX idx_auditoria_empleado ON auditoria_horarios(empleado_id);



-- ============================================================================

-- TABLE: payroll_history

-- ============================================================================



CREATE TABLE payroll_history (

    id                  NUMBER(10) PRIMARY KEY,

    employee_id         NUMBER(10) NOT NULL,

    payroll_period      VARCHAR2(50) NOT NULL,

    period_start        DATE NOT NULL,

    period_end          DATE NOT NULL,

    

    base_salary         NUMBER(12, 2),

    overtime_pay        NUMBER(12, 2) DEFAULT 0,

    bonuses             NUMBER(12, 2) DEFAULT 0,

    commissions         NUMBER(12, 2) DEFAULT 0,

    other_income        NUMBER(12, 2) DEFAULT 0,

    gross_pay           NUMBER(12, 2),

    

    isr_tax             NUMBER(12, 2) DEFAULT 0,

    imss_employee       NUMBER(12, 2) DEFAULT 0,

    infonavit_discount  NUMBER(12, 2) DEFAULT 0,

    fonacot_discount    NUMBER(12, 2) DEFAULT 0,

    other_deductions    NUMBER(12, 2) DEFAULT 0,

    total_deductions    NUMBER(12, 2),

    

    net_pay             NUMBER(12, 2),

    

    payment_status      VARCHAR2(50) DEFAULT 'PENDING',

    payment_date        DATE,

    payment_method      VARCHAR2(50),

    

    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    created_by          NUMBER(10),

    

    CONSTRAINT fk_payroll_employee FOREIGN KEY (employee_id) REFERENCES users(id),

    CONSTRAINT fk_payroll_created_by FOREIGN KEY (created_by) REFERENCES users(id),

    CONSTRAINT chk_payroll_status CHECK (payment_status IN ('PENDING', 'PROCESSED', 'PAID', 'CANCELLED'))

);



CREATE INDEX idx_payroll_employee ON payroll_history(employee_id);

CREATE INDEX idx_payroll_period ON payroll_history(payroll_period);



-- ============================================================================

-- TRIGGERS

-- ============================================================================



CREATE OR REPLACE TRIGGER trg_users_bi

BEFORE INSERT ON users FOR EACH ROW

BEGIN

    IF :NEW.id IS NULL THEN

        SELECT seq_users.NEXTVAL INTO :NEW.id FROM dual;

    END IF;

    :NEW.created_at := CURRENT_TIMESTAMP;

    :NEW.updated_at := CURRENT_TIMESTAMP;

END;

/



CREATE OR REPLACE TRIGGER trg_users_bu

BEFORE UPDATE ON users FOR EACH ROW

BEGIN

    :NEW.updated_at := CURRENT_TIMESTAMP;

END;

/



CREATE OR REPLACE TRIGGER trg_absence_requests_bi

BEFORE INSERT ON absence_requests FOR EACH ROW

BEGIN

    IF :NEW.id IS NULL THEN

        SELECT seq_absence_requests.NEXTVAL INTO :NEW.id FROM dual;

    END IF;

    :NEW.created_at := CURRENT_TIMESTAMP;

    :NEW.updated_at := CURRENT_TIMESTAMP;

END;

/



CREATE OR REPLACE TRIGGER trg_absence_requests_bu

BEFORE UPDATE ON absence_requests FOR EACH ROW

BEGIN

    :NEW.updated_at := CURRENT_TIMESTAMP;

END;

/



CREATE OR REPLACE TRIGGER trg_approval_history_bi

BEFORE INSERT ON approval_history FOR EACH ROW

BEGIN

    IF :NEW.id IS NULL THEN

        SELECT seq_approval_history.NEXTVAL INTO :NEW.id FROM dual;

    END IF;

    :NEW.created_at := CURRENT_TIMESTAMP;

    :NEW.updated_at := CURRENT_TIMESTAMP;

END;

/



CREATE OR REPLACE TRIGGER trg_approval_history_bu

BEFORE UPDATE ON approval_history FOR EACH ROW

BEGIN

    :NEW.updated_at := CURRENT_TIMESTAMP;

END;

/



CREATE OR REPLACE TRIGGER trg_notifications_bi

BEFORE INSERT ON notifications FOR EACH ROW

BEGIN

    IF :NEW.id IS NULL THEN

        SELECT seq_notifications.NEXTVAL INTO :NEW.id FROM dual;

    END IF;

END;

/



CREATE OR REPLACE TRIGGER trg_turnos_bi

BEFORE INSERT ON turnos FOR EACH ROW

BEGIN

    IF :NEW.id IS NULL THEN

        SELECT seq_turnos.NEXTVAL INTO :NEW.id FROM dual;

    END IF;

END;

/



CREATE OR REPLACE TRIGGER trg_horarios_base_bi

BEFORE INSERT ON horarios_base FOR EACH ROW

BEGIN

    IF :NEW.id IS NULL THEN

        SELECT seq_horarios_base.NEXTVAL INTO :NEW.id FROM dual;

    END IF;

END;

/



CREATE OR REPLACE TRIGGER trg_horarios_excepcion_bi

BEFORE INSERT ON horarios_excepcion FOR EACH ROW

BEGIN

    IF :NEW.id IS NULL THEN

        SELECT seq_horarios_excepcion.NEXTVAL INTO :NEW.id FROM dual;

    END IF;

END;

/



CREATE OR REPLACE TRIGGER trg_auditoria_horarios_bi

BEFORE INSERT ON auditoria_horarios FOR EACH ROW

BEGIN

    IF :NEW.id IS NULL THEN

        SELECT seq_auditoria_horarios.NEXTVAL INTO :NEW.id FROM dual;

    END IF;

END;

/



CREATE OR REPLACE TRIGGER trg_emergency_contacts_bi

BEFORE INSERT ON emergency_contacts FOR EACH ROW

BEGIN

    IF :NEW.id IS NULL THEN

        SELECT seq_emergency_contacts.NEXTVAL INTO :NEW.id FROM dual;

    END IF;

    :NEW.created_at := CURRENT_TIMESTAMP;

    :NEW.updated_at := CURRENT_TIMESTAMP;

END;

/



CREATE OR REPLACE TRIGGER trg_emergency_contacts_bu

BEFORE UPDATE ON emergency_contacts FOR EACH ROW

BEGIN

    :NEW.updated_at := CURRENT_TIMESTAMP;

END;

/



CREATE OR REPLACE TRIGGER trg_dependents_bi

BEFORE INSERT ON dependents FOR EACH ROW

BEGIN

    IF :NEW.id IS NULL THEN

        SELECT seq_dependents.NEXTVAL INTO :NEW.id FROM dual;

    END IF;

    :NEW.created_at := CURRENT_TIMESTAMP;

    :NEW.updated_at := CURRENT_TIMESTAMP;

END;

/



CREATE OR REPLACE TRIGGER trg_dependents_bu

BEFORE UPDATE ON dependents FOR EACH ROW

BEGIN

    :NEW.updated_at := CURRENT_TIMESTAMP;

END;

/



CREATE OR REPLACE TRIGGER trg_employee_documents_bi

BEFORE INSERT ON employee_documents FOR EACH ROW

BEGIN

    IF :NEW.id IS NULL THEN

        SELECT seq_employee_documents.NEXTVAL INTO :NEW.id FROM dual;

    END IF;

    :NEW.created_at := CURRENT_TIMESTAMP;

    :NEW.updated_at := CURRENT_TIMESTAMP;

END;

/



CREATE OR REPLACE TRIGGER trg_employee_documents_bu

BEFORE UPDATE ON employee_documents FOR EACH ROW

BEGIN

    :NEW.updated_at := CURRENT_TIMESTAMP;

END;

/



CREATE OR REPLACE TRIGGER trg_job_history_bi

BEFORE INSERT ON job_history FOR EACH ROW

BEGIN

    IF :NEW.id IS NULL THEN

        SELECT seq_job_history.NEXTVAL INTO :NEW.id FROM dual;

    END IF;

END;

/



CREATE OR REPLACE TRIGGER trg_time_off_balances_bi

BEFORE INSERT ON time_off_balances FOR EACH ROW

BEGIN

    IF :NEW.id IS NULL THEN

        SELECT seq_time_off_balances.NEXTVAL INTO :NEW.id FROM dual;

    END IF;

    :NEW.created_at := CURRENT_TIMESTAMP;

    :NEW.updated_at := CURRENT_TIMESTAMP;

END;

/



CREATE OR REPLACE TRIGGER trg_time_off_balances_bu

BEFORE UPDATE ON time_off_balances FOR EACH ROW

BEGIN

    :NEW.updated_at := CURRENT_TIMESTAMP;

END;

/



CREATE OR REPLACE TRIGGER trg_employee_benefits_bi

BEFORE INSERT ON employee_benefits FOR EACH ROW

BEGIN

    IF :NEW.id IS NULL THEN

        SELECT seq_employee_benefits.NEXTVAL INTO :NEW.id FROM dual;

    END IF;

    :NEW.created_at := CURRENT_TIMESTAMP;

    :NEW.updated_at := CURRENT_TIMESTAMP;

END;

/



CREATE OR REPLACE TRIGGER trg_employee_benefits_bu

BEFORE UPDATE ON employee_benefits FOR EACH ROW

BEGIN

    :NEW.updated_at := CURRENT_TIMESTAMP;

END;

/



CREATE OR REPLACE TRIGGER trg_payroll_history_bi

BEFORE INSERT ON payroll_history FOR EACH ROW

BEGIN

    IF :NEW.id IS NULL THEN

        SELECT seq_payroll_history.NEXTVAL INTO :NEW.id FROM dual;

    END IF;

END;

/



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



-- ============================================================================

-- END OF SCRIPT

-- ============================================================================

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

-- ============================================================================
-- END OF SCRIPT
-- ============================================================================