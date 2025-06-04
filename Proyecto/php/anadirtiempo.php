<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../circuit_list.html');
    exit;
}

$circuit_id = $_POST['circuit_id'] ?? '';
$tiempo = trim($_POST['tiempo'] ?? '');
$vehiculo = trim($_POST['vehiculo'] ?? '');
$fecha = $_POST['fecha'] ?? '';

if (empty($circuit_id) || empty($tiempo) || empty($vehiculo) || empty($fecha)) {
    header("Location: ../tiemposcircuito.html?circuit=$circuit_id");
    exit;
}

// Validar formato de tiempo (mm:ss:dd) - décimas
if (!preg_match('/^(\d{1,2}):([0-5]?\d):(\d{1,2})$/', $tiempo, $matches)) {
    header("Location: ../tiemposcircuito.html?circuit=$circuit_id");
    exit;
}

$minutes = intval($matches[1]);
$seconds = intval($matches[2]);
$decimas = intval($matches[3]);

// Validar rangos
if ($minutes > 99 || $seconds > 59 || $decimas > 99) {
    header("Location: ../tiemposcircuito.html?circuit=$circuit_id");
    exit;
}

// Validar fecha
if (strtotime($fecha) > strtotime('today')) {
    header("Location: ../tiemposcircuito.html?circuit=$circuit_id");
    exit;
}

// Validar que el vehículo sea uno de los permitidos
$vehiculos_permitidos = ['Kart Rotax', 'Kart alquiler 390cc', 'moto'];
if (!in_array($vehiculo, $vehiculos_permitidos)) {
    header("Location: ../tiemposcircuito.html?circuit=$circuit_id");
    exit;
}

try {
    // Verificar que el circuito existe
    $stmt = $pdo->prepare("SELECT nombre FROM Circuitos WHERE id = ?");
    $stmt->execute([$circuit_id]);
    $circuit = $stmt->fetch();
    
    if (!$circuit) {
        header("Location: ../tiemposcircuito.html?circuit=$circuit_id");
        exit;
    }
    
    // Convertir tiempo a formato TIME de MySQL
    $time_mysql = sprintf('%02d:%02d:%02d', 0, $minutes, $seconds);
    
    $user_id = getCurrentUserId() ?: 1;
    
    // Insertar tiempo con décimas (convertidas a milisegundos para compatibilidad)
    $milisegundos = $decimas * 10; // Convertir décimas a milisegundos
    
    $stmt = $pdo->prepare("INSERT INTO Tiempos (usuario_id, circuito_id, tiempo, fecha, milisegundos, tiempo_completo, vehiculo) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$user_id, $circuit_id, $time_mysql, $fecha, $milisegundos, $tiempo, $vehiculo]);
    
    // Registrar auditoría
    if (getCurrentUserId()) {
        $detalle = sprintf('Tiempo: %s, Circuito: %s, Vehiculo: %s', $tiempo, $circuit['nombre'], $vehiculo);
        logAuditoria($pdo, getCurrentUserId(), 'INSERT', 'Tiempos', $detalle);
    }
    
    header("Location: ../tiemposcircuito.html?circuit=$circuit_id");
    exit;
    
} catch(PDOException $e) {
    error_log("Error agregando tiempo: " . $e->getMessage());
    header("Location: ../tiemposcircuito.html?circuit=$circuit_id");
    exit;
}
?>