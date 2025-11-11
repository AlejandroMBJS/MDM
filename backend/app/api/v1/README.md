# API Endpoints Documentation

This document provides curl commands to test all API endpoints in the system. Make sure to replace the following placeholders:
- `{token}`: Your JWT token obtained after login
- `{base_url}`: Your API base URL (e.g., http://localhost:8000)
- `{id}`: The ID of the resource you're interacting with
- `{user_id}`: The ID of the user

## Table of Contents
- [Authentication](#authentication)
- [Users](#users)
- [Dependents](#dependents)
- [Emergency Contacts](#emergency-contacts)
- [Employee Documents](#employee-documents)
- [Job History](#job-history)
- [Time Off Balances](#time-off-balances)
- [Employee Benefits](#employee-benefits)
- [Turnos](#turnos)
- [Horarios Base](#horarios-base)
- [Horarios Excepción](#horarios-excepción)
- [Auditoría Horarios](#auditoría-horarios)
- [Payroll History](#payroll-history)
- [Absence Requests](#absence-requests)
- [Approval History](#approval-history)
- [Notifications](#notifications)

## Authentication

### Login
```bash
curl -X POST {base_url}/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "yourpassword"}'
```

## Users

### Get Current User
```bash
curl -X GET {base_url}/api/v1/users/me \
  -H "Authorization: Bearer {token}"
```

### Get All Users
```bash
curl -X GET {base_url}/api/v1/users/ \
  -H "Authorization: Bearer {token}"
```

### Get User by ID
```bash
curl -X GET {base_url}/api/v1/users/{id} \
  -H "Authorization: Bearer {token}"
```

## User-Specific Routes

### Emergency Contacts

#### List Emergency Contacts for User
```bash
curl -X GET {base_url}/api/v1/users/{user_id}/emergency-contacts/ \
  -H "Authorization: Bearer {token}"
```

#### Create Emergency Contact for User
```bash
curl -X POST {base_url}/api/v1/users/{user_id}/emergency-contacts/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "contact_name": "John Doe",
    "relationship": "Spouse",
    "phone_number": "+1234567890",
    "is_primary": true
  }'
```

### Dependents

#### List Dependents for User
```bash
curl -X GET {base_url}/api/v1/users/{user_id}/dependents/ \
  -H "Authorization: Bearer {token}"
```

#### Create Dependent for User
```bash
curl -X POST {base_url}/api/v1/users/{user_id}/dependents/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "dependent_name": "Jane Doe",
    "relationship": "Daughter",
    "birth_date": "2020-01-01",
    "is_beneficiary": true,
    "beneficiary_percentage": 100
  }'
```

### Job History

#### List Job History for User
```bash
curl -X GET {base_url}/api/v1/users/{user_id}/job-history/ \
  -H "Authorization: Bearer {token}"
```

### Time Off Balances

#### List Time Off Balances for User
```bash
curl -X GET {base_url}/api/v1/users/{user_id}/time-off-balances/ \
  -H "Authorization: Bearer {token}"
```

### Employee Benefits

#### List Employee Benefits for User
```bash
curl -X GET {base_url}/api/v1/users/{user_id}/employee-benefits/ \
  -H "Authorization: Bearer {token}"
```

### Documents

#### List Documents for User
```bash
curl -X GET {base_url}/api/v1/users/{user_id}/documents/ \
  -H "Authorization: Bearer {token}"
```

### Horarios

#### List Base Schedules for User
```bash
curl -X GET {base_url}/api/v1/users/{user_id}/horarios-base/ \
  -H "Authorization: Bearer {token}"
```

#### List Exception Schedules for User
```bash
curl -X GET {base_url}/api/v1/users/{user_id}/horarios-excepcion/ \
  -H "Authorization: Bearer {token}"
```

### Payroll

#### List Payroll History for User
```bash
curl -X GET {base_url}/api/v1/users/{user_id}/payroll-history/ \
  -H "Authorization: Bearer {token}"
```

### Absence Requests

#### List Absence Requests for User
```bash
curl -X GET {base_url}/api/v1/users/{user_id}/absence-requests/ \
  -H "Authorization: Bearer {token}"
```

### Notifications

#### List Notifications for User
```bash
curl -X GET {base_url}/api/v1/users/{user_id}/notifications/ \
  -H "Authorization: Bearer {token}"
```

## Dependents

### Create Dependent
```bash
curl -X POST {base_url}/api/v1/dependents/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": 1,
    "dependent_name": "John Doe",
    "relationship": "Son",
    "birth_date": "2000-01-01",
    "gender": "Male",
    "is_beneficiary": true,
    "beneficiary_percentage": 100,
    "is_dependent": true,
    "has_disability": false
  }'
```

### Get All Dependents
```bash
curl -X GET {base_url}/api/v1/dependents/ \
  -H "Authorization: Bearer {token}"
```

### Get Dependent by ID
```bash
curl -X GET {base_url}/api/v1/dependents/{id} \
  -H "Authorization: Bearer {token}"
```

### Update Dependent
```bash
curl -X PUT {base_url}/api/v1/dependents/{id} \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "dependent_name": "Updated Name",
    "relationship": "Daughter"
  }'
```

### Delete Dependent
```bash
curl -X DELETE {base_url}/api/v1/dependents/{id} \
  -H "Authorization: Bearer {token}"
```

## Emergency Contacts

### Create Emergency Contact
```bash
curl -X POST {base_url}/api/v1/emergency-contacts/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": 1,
    "contact_name": "Emergency Contact",
    "relationship": "Spouse",
    "phone_number": "+1234567890",
    "is_primary": true
  }'
```

### Get All Emergency Contacts
```bash
curl -X GET {base_url}/api/v1/emergency-contacts/ \
  -H "Authorization: Bearer {token}"
```

## Employee Documents

### Upload Document
```bash
curl -X POST {base_url}/api/v1/employee-documents/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/document.pdf" \
  -F "document_type=contract" \
  -F "employee_id=1"
```

## Job History

### Create Job History
```bash
curl -X POST {base_url}/api/v1/job-history/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": 1,
    "position_title": "Software Developer",
    "department": "IT",
    "start_date": "2023-01-01",
    "is_current": true
  }'
```

## Time Off Balances

### Get Time Off Balance
```bash
curl -X GET {base_url}/api/v1/time-off-balances/ \
  -H "Authorization: Bearer {token}"
```

## Employee Benefits

### Get Employee Benefits
```bash
curl -X GET {base_url}/api/v1/employee-benefits/ \
  -H "Authorization: Bearer {token}"
```

## Turnos

### Get All Turnos
```bash
curl -X GET {base_url}/api/v1/turnos/ \
  -H "Authorization: Bearer {token}"
```

## Horarios Base

### Create Horario Base
```bash
curl -X POST {base_url}/api/v1/horarios-base/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": 1,
    "day_of_week": 1,
    "start_time": "09:00:00",
    "end_time": "18:00:00"
  }'
```

## Horarios Excepción

### Create Horario Excepción
```bash
curl -X POST {base_url}/api/v1/horarios-excepcion/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": 1,
    "date": "2023-12-25",
    "is_holiday": true,
    "notes": "Christmas Day"
  }'
```

## Auditoría Horarios

### Get Auditoría
```bash
curl -X GET {base_url}/api/v1/auditoria-horarios/ \
  -H "Authorization: Bearer {token}"
```

## Payroll History

### Get Payroll History
```bash
curl -X GET {base_url}/api/v1/payroll-history/ \
  -H "Authorization: Bearer {token}"
```

## Absence Requests

### Create Absence Request
```bash
curl -X POST {base_url}/api/v1/absence-requests/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": 1,
    "start_date": "2023-12-20",
    "end_date": "2023-12-22",
    "reason": "Vacation",
    "status": "pending"
  }'
```

## Approval History

### Get Approval History
```bash
curl -X GET {base_url}/api/v1/approval-history/ \
  -H "Authorization: Bearer {token}"
```

## Notifications

### Get Notifications
```bash
curl -X GET {base_url}/api/v1/notifications/ \
  -H "Authorization: Bearer {token}"
```

## Notes
- All endpoints require authentication unless specified otherwise
- Replace all placeholders with actual values
- The base URL should point to your API server
- For file uploads, use `-F` for form data instead of `-d`
- For dates, use the format `YYYY-MM-DD`
- For times, use the 24-hour format `HH:MM:SS`
