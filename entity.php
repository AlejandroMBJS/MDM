<?php
// entity.php - MDM Entity CRUD Manager
session_start();

if (!isset($_SESSION['token'])) {
    header('Location: index.php');
    exit;
}

define('API_URL', 'http://localhost:8000/api/v1');

// Get entity type
$entityType = $_GET['type'] ?? 'users';
$action = $_GET['action'] ?? 'list';
$id = $_GET['id'] ?? null;

// Entity configurations
$entities = [
    'users' => [
        'name' => 'Users',
        'endpoint' => '/users/',
        'icon' => 'fa-users',
        'color' => 'indigo',
        'fields' => [
            'name' => ['type' => 'text', 'label' => 'Full Name', 'required' => true],
            'email' => ['type' => 'email', 'label' => 'Email', 'required' => true],
            'password' => ['type' => 'password', 'label' => 'Password', 'required' => true, 'create_only' => true],
            'role' => ['type' => 'select', 'label' => 'Role', 'required' => true, 'options' => ['employee', 'manager', 'admin']],
            'department' => ['type' => 'text', 'label' => 'Department'],
            'position_title' => ['type' => 'text', 'label' => 'Position'],
            'hire_date' => ['type' => 'date', 'label' => 'Hire Date'],
            'salary' => ['type' => 'number', 'label' => 'Salary', 'step' => '0.01'],
        ]
    ],
    'absence_requests' => [
        'name' => 'Absence Requests',
        'endpoint' => '/absence-requests/',
        'icon' => 'fa-calendar-times',
        'color' => 'yellow',
        'fields' => [
            'employee_id' => ['type' => 'number', 'label' => 'Employee ID', 'required' => true],
            'request_type' => ['type' => 'select', 'label' => 'Type', 'required' => true, 
                               'options' => ['Vacation', 'Sick Leave', 'Personal Leave', 'Maternity', 'Paternity']],
            'start_date' => ['type' => 'date', 'label' => 'Start Date', 'required' => true],
            'end_date' => ['type' => 'date', 'label' => 'End Date', 'required' => true],
            'total_days' => ['type' => 'number', 'label' => 'Total Days', 'required' => true, 'step' => '0.5'],
            'reason' => ['type' => 'textarea', 'label' => 'Reason', 'required' => true],
            'status' => ['type' => 'select', 'label' => 'Status', 'options' => ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']],
        ]
    ],
    'schedules' => [
        'name' => 'Schedules',
        'endpoint' => '/horarios-base/',
        'icon' => 'fa-calendar-alt',
        'color' => 'green',
        'fields' => [
            'empleado_id' => ['type' => 'number', 'label' => 'Employee ID', 'required' => true],
            'turno_id' => ['type' => 'number', 'label' => 'Shift ID', 'required' => true],
            'dia_semana' => ['type' => 'select', 'label' => 'Day of Week', 'required' => true,
                            'options' => ['Sunday' => 0, 'Monday' => 1, 'Tuesday' => 2, 'Wednesday' => 3, 
                                        'Thursday' => 4, 'Friday' => 5, 'Saturday' => 6]],
        ]
    ],
    'turnos' => [
        'name' => 'Shifts',
        'endpoint' => '/turnos/',
        'icon' => 'fa-clock',
        'color' => 'blue',
        'fields' => [
            'nombre' => ['type' => 'text', 'label' => 'Name', 'required' => true],
            'codigo' => ['type' => 'text', 'label' => 'Code', 'required' => true],
            'hora_inicio' => ['type' => 'time', 'label' => 'Start Time', 'required' => true],
            'hora_fin' => ['type' => 'time', 'label' => 'End Time', 'required' => true],
            'es_descanso' => ['type' => 'checkbox', 'label' => 'Is Rest Day'],
            'activo' => ['type' => 'checkbox', 'label' => 'Active'],
        ]
    ],
    'payroll' => [
        'name' => 'Payroll',
        'endpoint' => '/payroll/',
        'icon' => 'fa-money-bill-wave',
        'color' => 'purple',
        'fields' => [
            'employee_id' => ['type' => 'number', 'label' => 'Employee ID', 'required' => true],
            'payroll_period' => ['type' => 'text', 'label' => 'Period', 'required' => true],
            'period_start' => ['type' => 'date', 'label' => 'Period Start', 'required' => true],
            'period_end' => ['type' => 'date', 'label' => 'Period End', 'required' => true],
            'base_salary' => ['type' => 'number', 'label' => 'Base Salary', 'step' => '0.01'],
            'gross_pay' => ['type' => 'number', 'label' => 'Gross Pay', 'step' => '0.01'],
            'total_deductions' => ['type' => 'number', 'label' => 'Total Deductions', 'step' => '0.01'],
            'net_pay' => ['type' => 'number', 'label' => 'Net Pay', 'step' => '0.01'],
            'payment_status' => ['type' => 'select', 'label' => 'Status', 
                                'options' => ['PENDING', 'PROCESSED', 'PAID', 'CANCELLED']],
        ]
    ],
    'audits' => [
        'name' => 'Time Audits',
        'endpoint' => '/auditoria-horarios/',
        'icon' => 'fa-clipboard-check',
        'color' => 'red',
        'fields' => [
            'empleado_id' => ['type' => 'number', 'label' => 'Employee ID', 'required' => true],
            'fecha' => ['type' => 'date', 'label' => 'Date', 'required' => true],
            'hora_entrada' => ['type' => 'time', 'label' => 'Check In'],
            'hora_salida' => ['type' => 'time', 'label' => 'Check Out'],
            'estado' => ['type' => 'select', 'label' => 'Status', 
                        'options' => ['puntual', 'tarde', 'ausente', 'temprano']],
            'notas' => ['type' => 'textarea', 'label' => 'Notes'],
        ]
    ],
    'benefits' => [
        'name' => 'Benefits',
        'endpoint' => '/benefits/',
        'icon' => 'fa-gift',
        'color' => 'pink',
        'fields' => [
            'employee_id' => ['type' => 'number', 'label' => 'Employee ID', 'required' => true],
            'benefit_type' => ['type' => 'text', 'label' => 'Benefit Type', 'required' => true],
            'benefit_name' => ['type' => 'text', 'label' => 'Benefit Name', 'required' => true],
            'provider' => ['type' => 'text', 'label' => 'Provider'],
            'start_date' => ['type' => 'date', 'label' => 'Start Date', 'required' => true],
            'end_date' => ['type' => 'date', 'label' => 'End Date'],
            'is_active' => ['type' => 'checkbox', 'label' => 'Active'],
        ]
    ],
    'notifications' => [
        'name' => 'Notifications',
        'endpoint' => '/notifications/',
        'icon' => 'fa-bell',
        'color' => 'orange',
        'fields' => [
            'user_id' => ['type' => 'number', 'label' => 'User ID', 'required' => true],
            'message' => ['type' => 'textarea', 'label' => 'Message', 'required' => true],
            'notification_type' => ['type' => 'text', 'label' => 'Type'],
            'is_read' => ['type' => 'checkbox', 'label' => 'Read'],
        ]
    ],
];

$currentEntity = $entities[$entityType] ?? $entities['users'];

// API Helper Function
function apiCall($endpoint, $method = 'GET', $data = null) {
    $ch = curl_init(API_URL . $endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $_SESSION['token'],
        'Content-Type: application/json'
    ]);
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    } elseif ($method === 'PUT') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    } elseif ($method === 'DELETE') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return ['code' => $httpCode, 'data' => json_decode($response, true)];
}

// Handle form submission
$message = null;
$messageType = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $formData = [];
    foreach ($currentEntity['fields'] as $fieldName => $fieldConfig) {
        if ($fieldConfig['type'] === 'checkbox') {
            $formData[$fieldName] = isset($_POST[$fieldName]);
        } elseif (!isset($fieldConfig['create_only']) || $action === 'create') {
            $value = $_POST[$fieldName] ?? null;
            if ($fieldConfig['type'] === 'number' && $value !== null && $value !== '') {
                $formData[$fieldName] = (float)$value;
            } else {
                $formData[$fieldName] = $value;
            }
        }
    }
    
    if ($action === 'create') {
        $result = apiCall($currentEntity['endpoint'], 'POST', $formData);
        if ($result['code'] >= 200 && $result['code'] < 300) {
            $message = "Record created successfully!";
            $messageType = "success";
            header("Location: entity.php?type=$entityType&message=created");
            exit;
        } else {
            $message = "Error creating record: " . json_encode($result['data']);
            $messageType = "error";
        }
    } elseif ($action === 'edit' && $id) {
        $result = apiCall($currentEntity['endpoint'] . '/' . $id, 'PUT', $formData);
        if ($result['code'] >= 200 && $result['code'] < 300) {
            $message = "Record updated successfully!";
            $messageType = "success";
            header("Location: entity.php?type=$entityType&message=updated");
            exit;
        } else {
            $message = "Error updating record: " . json_encode($result['data']);
            $messageType = "error";
        }
    }
}

// Handle delete
if ($action === 'delete' && $id) {
    $result = apiCall($currentEntity['endpoint'] . '/' . $id, 'DELETE');
    if ($result['code'] === 204 || $result['code'] === 200) {
        header("Location: entity.php?type=$entityType&message=deleted");
        exit;
    }
}

// Fetch data
$records = [];
$record = null;

if ($action === 'list') {
    $result = apiCall($currentEntity['endpoint']);
    $records = $result['data'] ?? [];
} elseif ($action === 'edit' && $id) {
    $result = apiCall($currentEntity['endpoint'] . '/' . $id);
    $record = $result['data'] ?? null;
}

// Get message from URL
if (isset($_GET['message'])) {
    $messages = [
        'created' => 'Record created successfully!',
        'updated' => 'Record updated successfully!',
        'deleted' => 'Record deleted successfully!'
    ];
    $message = $messages[$_GET['message']] ?? '';
    $messageType = 'success';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $currentEntity['name'] ?> - MDM</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-md border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <div class="flex items-center gap-4">
                    <a href="index.php" class="text-gray-600 hover:text-gray-900">
                        <i class="fas fa-arrow-left"></i>
                    </a>
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-<?= $currentEntity['color'] ?>-100 rounded-lg flex items-center justify-center">
                            <i class="fas <?= $currentEntity['icon'] ?> text-<?= $currentEntity['color'] ?>-600"></i>
                        </div>
                        <div>
                            <h1 class="text-xl font-bold text-gray-900"><?= $currentEntity['name'] ?></h1>
                            <p class="text-xs text-gray-500">Data Management</p>
                        </div>
                    </div>
                </div>
                
                <a href="index.php" class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                    <i class="fas fa-home mr-1"></i>Dashboard
                </a>
            </div>
        </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <?php if ($message): ?>
            <div class="mb-6 bg-<?= $messageType === 'success' ? 'green' : 'red' ?>-50 border border-<?= $messageType === 'success' ? 'green' : 'red' ?>-200 text-<?= $messageType === 'success' ? 'green' : 'red' ?>-700 px-4 py-3 rounded-lg">
                <i class="fas fa-<?= $messageType === 'success' ? 'check-circle' : 'exclamation-circle' ?> mr-2"></i>
                <?= htmlspecialchars($message) ?>
            </div>
        <?php endif; ?>

        <?php if ($action === 'list'): ?>
            <!-- List View -->
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-gray-900">
                    <i class="fas fa-list mr-2"></i>All <?= $currentEntity['name'] ?>
                </h2>
                <a href="?type=<?= $entityType ?>&action=create" 
                   class="px-4 py-2 bg-<?= $currentEntity['color'] ?>-600 text-white rounded-lg hover:bg-<?= $currentEntity['color'] ?>-700 transition-colors">
                    <i class="fas fa-plus mr-2"></i>Create New
                </a>
            </div>

            <div class="bg-white rounded-xl shadow-md overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <?php foreach (array_slice(array_keys($currentEntity['fields']), 0, 5) as $field): ?>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        <?= $currentEntity['fields'][$field]['label'] ?>
                                    </th>
                                <?php endforeach; ?>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            <?php foreach ($records as $row): ?>
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap font-medium"><?= $row['id'] ?></td>
                                    <?php foreach (array_slice(array_keys($currentEntity['fields']), 0, 5) as $field): ?>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <?php 
                                            $value = $row[$field] ?? 'N/A';
                                            if (is_bool($value)) {
                                                echo '<span class="px-2 py-1 rounded-full text-xs ' . 
                                                     ($value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800') . '">' .
                                                     ($value ? 'Yes' : 'No') . '</span>';
                                            } else {
                                                echo htmlspecialchars(substr($value, 0, 50));
                                            }
                                            ?>
                                        </td>
                                    <?php endforeach; ?>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex gap-2">
                                            <a href="?type=<?= $entityType ?>&action=edit&id=<?= $row['id'] ?>" 
                                               class="text-blue-600 hover:text-blue-800">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                            <a href="?type=<?= $entityType ?>&action=delete&id=<?= $row['id'] ?>" 
                                               onclick="return confirm('Are you sure you want to delete this record?')"
                                               class="text-red-600 hover:text-red-800">
                                                <i class="fas fa-trash"></i>
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>

        <?php elseif ($action === 'create' || $action === 'edit'): ?>
            <!-- Create/Edit Form -->
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-gray-900">
                    <i class="fas fa-<?= $action === 'create' ? 'plus' : 'edit' ?> mr-2"></i>
                    <?= $action === 'create' ? 'Create' : 'Edit' ?> <?= $currentEntity['name'] ?>
                </h2>
                <a href="?type=<?= $entityType ?>" 
                   class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <i class="fas fa-times mr-2"></i>Cancel
                </a>
            </div>

            <div class="bg-white rounded-xl shadow-md p-6">
                <form method="POST" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <?php foreach ($currentEntity['fields'] as $fieldName => $fieldConfig): ?>
                            <?php if (isset($fieldConfig['create_only']) && $action === 'edit') continue; ?>
                            <div class="<?= $fieldConfig['type'] === 'textarea' ? 'md:col-span-2' : '' ?>">
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <?= $fieldConfig['label'] ?>
                                    <?php if ($fieldConfig['required'] ?? false): ?>
                                        <span class="text-red-500">*</span>
                                    <?php endif; ?>
                                </label>
                                
                                <?php if ($fieldConfig['type'] === 'textarea'): ?>
                                    <textarea name="<?= $fieldName ?>" rows="3"
                                              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-<?= $currentEntity['color'] ?>-500"
                                              <?= ($fieldConfig['required'] ?? false) ? 'required' : '' ?>><?= htmlspecialchars($record[$fieldName] ?? '') ?></textarea>
                                
                                <?php elseif ($fieldConfig['type'] === 'select'): ?>
                                    <select name="<?= $fieldName ?>"
                                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-<?= $currentEntity['color'] ?>-500"
                                            <?= ($fieldConfig['required'] ?? false) ? 'required' : '' ?>>
                                        <option value="">Select...</option>
                                        <?php foreach ($fieldConfig['options'] as $key => $value): ?>
                                            <?php 
                                            $optVal = is_numeric($key) ? $value : $key;
                                            $optLabel = is_numeric($key) ? $value : "$key ($value)";
                                            $selected = ($record[$fieldName] ?? '') == $value ? 'selected' : '';
                                            ?>
                                            <option value="<?= $value ?>" <?= $selected ?>><?= $optLabel ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                
                                <?php elseif ($fieldConfig['type'] === 'checkbox'): ?>
                                    <input type="checkbox" name="<?= $fieldName ?>" value="1"
                                           class="w-4 h-4 text-<?= $currentEntity['color'] ?>-600 border-gray-300 rounded focus:ring-<?= $currentEntity['color'] ?>-500"
                                           <?= ($record[$fieldName] ?? false) ? 'checked' : '' ?>>
                                
                                <?php else: ?>
                                    <input type="<?= $fieldConfig['type'] ?>" name="<?= $fieldName ?>"
                                           value="<?= htmlspecialchars($record[$fieldName] ?? '') ?>"
                                           <?= isset($fieldConfig['step']) ? 'step="' . $fieldConfig['step'] . '"' : '' ?>
                                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-<?= $currentEntity['color'] ?>-500"
                                           <?= ($fieldConfig['required'] ?? false) ? 'required' : '' ?>>
                                <?php endif; ?>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    
                    <div class="flex gap-4 pt-4 border-t">
                        <button type="submit" 
                                class="flex-1 px-6 py-3 bg-<?= $currentEntity['color'] ?>-600 text-white rounded-lg hover:bg-<?= $currentEntity['color'] ?>-700 transition-colors font-medium">
                            <i class="fas fa-save mr-2"></i><?= $action === 'create' ? 'Create' : 'Update' ?> Record
                        </button>
                        <a href="?type=<?= $entityType ?>" 
                           class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center">
                            <i class="fas fa-times mr-2"></i>Cancel
                        </a>
                    </div>
                </form>
            </div>
        <?php endif; ?>
    </main>
</body>
</html>
