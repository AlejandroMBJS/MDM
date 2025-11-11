<?php
// index.php - MDM Master Data Management Dashboard
session_start();

// Configuration
define('API_URL', 'http://localhost:8000/api/v1');
define('APP_NAME', 'MDM - Master Data Management');

// Check if user is logged in
$isLoggedIn = isset($_SESSION['token']);

// Handle logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: index.php');
    exit;
}

// Handle login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    
    $ch = curl_init(API_URL . '/auth/login');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'email' => $email,
        'password' => $password
    ]));
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        $data = json_decode($response, true);
        $_SESSION['token'] = $data['access_token'];
        $_SESSION['user'] = ['email' => $email];
        header('Location: index.php');
        exit;
    } else {
        $error = "Invalid credentials";
    }
}

// Function to make API calls
function apiCall($endpoint, $method = 'GET', $data = null) {
    if (!isset($_SESSION['token'])) return null;
    
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
    
    if ($httpCode >= 200 && $httpCode < 300) {
        return json_decode($response, true);
    }
    return null;
}

// Get statistics
$stats = [];
if ($isLoggedIn) {
    $stats = [
        'users' => count(apiCall('/users') ?? []),
        'absence_requests' => count(apiCall('/absence-requests') ?? []),
        'schedules' => count(apiCall('/horarios-base') ?? []),
        'payrolls' => count(apiCall('/payroll') ?? []),
        'audits' => count(apiCall('/auditoria-horarios') ?? []),
        'notifications' => count(apiCall('/notifications') ?? []),
        'turnos' => count(apiCall('/turnos') ?? []),
        'benefits' => count(apiCall('/benefits') ?? []),
    ];
}

// MDM Entities Configuration
$entities = [
    'users' => [
        'name' => 'Users',
        'icon' => 'fa-users',
        'color' => 'indigo',
        'description' => 'Employee master data',
        'endpoint' => '/users'
    ],
    'absence_requests' => [
        'name' => 'Absence Requests',
        'icon' => 'fa-calendar-times',
        'color' => 'yellow',
        'description' => 'Leave and absence management',
        'endpoint' => '/absence-requests'
    ],
    'schedules' => [
        'name' => 'Schedules',
        'icon' => 'fa-calendar-alt',
        'color' => 'green',
        'description' => 'Work schedules and shifts',
        'endpoint' => '/horarios-base'
    ],
    'turnos' => [
        'name' => 'Shifts',
        'icon' => 'fa-clock',
        'color' => 'blue',
        'description' => 'Shift definitions',
        'endpoint' => '/turnos'
    ],
    'payroll' => [
        'name' => 'Payroll',
        'icon' => 'fa-money-bill-wave',
        'color' => 'purple',
        'description' => 'Payroll history',
        'endpoint' => '/payroll'
    ],
    'audits' => [
        'name' => 'Time Audits',
        'icon' => 'fa-clipboard-check',
        'color' => 'red',
        'description' => 'Time tracking audits',
        'endpoint' => '/auditoria-horarios'
    ],
    'benefits' => [
        'name' => 'Benefits',
        'icon' => 'fa-gift',
        'color' => 'pink',
        'description' => 'Employee benefits',
        'endpoint' => '/benefits'
    ],
    'notifications' => [
        'name' => 'Notifications',
        'icon' => 'fa-bell',
        'color' => 'orange',
        'description' => 'System notifications',
        'endpoint' => '/notifications'
    ],
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= APP_NAME ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-50">

<?php if (!$isLoggedIn): ?>
    <!-- Login Page -->
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <div class="text-center mb-8">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full mb-4">
                    <i class="fas fa-database text-white text-2xl"></i>
                </div>
                <h1 class="text-3xl font-bold text-gray-900"><?= APP_NAME ?></h1>
                <p class="text-gray-600 mt-2">Master Data Management System</p>
            </div>
            
            <?php if (isset($error)): ?>
                <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    <i class="fas fa-exclamation-circle mr-2"></i><?= htmlspecialchars($error) ?>
                </div>
            <?php endif; ?>
            
            <form method="POST" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i class="fas fa-envelope text-gray-400"></i>
                        </div>
                        <input type="email" name="email" required
                               class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                               placeholder="admin@company.com">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i class="fas fa-lock text-gray-400"></i>
                        </div>
                        <input type="password" name="password" required
                               class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                               placeholder="••••••••">
                    </div>
                </div>
                <button type="submit" name="login"
                        class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-lg">
                    <i class="fas fa-sign-in-alt mr-2"></i>Sign In
                </button>
            </form>
        </div>
    </div>

<?php else: ?>
    <!-- Main Dashboard -->
    <div class="min-h-screen">
        <!-- Header -->
        <header class="bg-white shadow-md border-b sticky top-0 z-40">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <i class="fas fa-database text-white"></i>
                        </div>
                        <div>
                            <h1 class="text-xl font-bold text-gray-900"><?= APP_NAME ?></h1>
                            <p class="text-xs text-gray-500">Centralized Data Control</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-4">
                        <div class="text-right">
                            <p class="text-sm font-medium text-gray-900">
                                <i class="fas fa-user-circle mr-1"></i>
                                <?= htmlspecialchars($_SESSION['user']['email']) ?>
                            </p>
                            <p class="text-xs text-gray-500">Data Administrator</p>
                        </div>
                        <a href="?logout=1" class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            <i class="fas fa-sign-out-alt mr-1"></i>Logout
                        </a>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Welcome Banner -->
            <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 mb-8 text-white">
                <h2 class="text-3xl font-bold mb-2">
                    <i class="fas fa-database mr-2"></i>Master Data Management Dashboard
                </h2>
                <p class="text-indigo-100">
                    Centralized hub for managing all enterprise data entities. 
                    Access, create, update, and delete records across all modules.
                </p>
            </div>

            <!-- Statistics Overview -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 font-medium">Total Users</p>
                            <p class="text-3xl font-bold text-gray-900 mt-2"><?= $stats['users'] ?></p>
                        </div>
                        <i class="fas fa-users text-5xl text-indigo-500 opacity-20"></i>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 font-medium">Active Schedules</p>
                            <p class="text-3xl font-bold text-gray-900 mt-2"><?= $stats['schedules'] ?></p>
                        </div>
                        <i class="fas fa-calendar-alt text-5xl text-green-500 opacity-20"></i>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 font-medium">Payroll Records</p>
                            <p class="text-3xl font-bold text-gray-900 mt-2"><?= $stats['payrolls'] ?></p>
                        </div>
                        <i class="fas fa-money-bill-wave text-5xl text-purple-500 opacity-20"></i>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 font-medium">Audit Logs</p>
                            <p class="text-3xl font-bold text-gray-900 mt-2"><?= $stats['audits'] ?></p>
                        </div>
                        <i class="fas fa-clipboard-check text-5xl text-red-500 opacity-20"></i>
                    </div>
                </div>
            </div>

            <!-- Data Entities Grid -->
            <div class="mb-6">
                <h3 class="text-2xl font-bold text-gray-900 mb-4">
                    <i class="fas fa-th-large mr-2"></i>Data Entities
                </h3>
                <p class="text-gray-600 mb-6">Select an entity to manage its records</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <?php foreach ($entities as $key => $entity): ?>
                    <a href="entity.php?type=<?= $key ?>" 
                       class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border-t-4 border-<?= $entity['color'] ?>-500 hover:scale-105 transform duration-200">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-<?= $entity['color'] ?>-100 rounded-lg flex items-center justify-center">
                                <i class="fas <?= $entity['icon'] ?> text-2xl text-<?= $entity['color'] ?>-600"></i>
                            </div>
                            <span class="px-3 py-1 bg-<?= $entity['color'] ?>-100 text-<?= $entity['color'] ?>-800 rounded-full text-sm font-medium">
                                <?= $stats[$key] ?? 0 ?>
                            </span>
                        </div>
                        <h4 class="text-lg font-bold text-gray-900 mb-2"><?= $entity['name'] ?></h4>
                        <p class="text-sm text-gray-600"><?= $entity['description'] ?></p>
                        <div class="mt-4 flex items-center text-<?= $entity['color'] ?>-600 text-sm font-medium">
                            Manage Records
                            <i class="fas fa-arrow-right ml-2"></i>
                        </div>
                    </a>
                <?php endforeach; ?>
            </div>

            <!-- Quick Actions -->
            <div class="mt-8 bg-white rounded-xl shadow-md p-6">
                <h3 class="text-xl font-bold text-gray-900 mb-4">
                    <i class="fas fa-bolt mr-2"></i>Quick Actions
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a href="entity.php?type=users&action=create" 
                       class="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                        <i class="fas fa-user-plus text-2xl text-indigo-600 mr-3"></i>
                        <div>
                            <p class="font-medium text-gray-900">Add New User</p>
                            <p class="text-sm text-gray-600">Create employee record</p>
                        </div>
                    </a>
                    
                    <a href="entity.php?type=turnos&action=create" 
                       class="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                        <i class="fas fa-clock text-2xl text-blue-600 mr-3"></i>
                        <div>
                            <p class="font-medium text-gray-900">Create Shift</p>
                            <p class="text-sm text-gray-600">Define work shift</p>
                        </div>
                    </a>
                    
                    <a href="entity.php?type=audits" 
                       class="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all">
                        <i class="fas fa-file-export text-2xl text-red-600 mr-3"></i>
                        <div>
                            <p class="font-medium text-gray-900">Export Reports</p>
                            <p class="text-sm text-gray-600">Download audit data</p>
                        </div>
                    </a>
                </div>
            </div>
        </main>
    </div>
<?php endif; ?>

<script>
// Auto-refresh stats every 30 seconds
<?php if ($isLoggedIn): ?>
setInterval(() => {
    location.reload();
}, 30000);
<?php endif; ?>
</script>

</body>
</html>
