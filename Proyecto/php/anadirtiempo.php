<?php
require_once 'config.php';

if (!checkAuth()) {
    header('Location: ../login.html');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../circuit_list.html');
    exit;
}

$circuit_id = $_POST['circuit_id'] ?? '';
$tiempo = trim($_POST['tiempo'] ?? '');
$vehiculo = trim($_POST['vehiculo'] ?? '');
$fecha = $_POST['fecha'] ?? '';

if (empty($circuit_id) || empty($tiempo) || empty($vehiculo) || empty($fecha)) {
    header("Location: ../circuit_times.html?circuit=$circuit_id&error=campos_vacios");
    exit;
}

// Validar formato de tiempo (mm:ss:ddd)
if (!preg_match('/^(\d{1,2}):([0-5]?\d):(\d{1,3})$/', $tiempo, $matches)) {
    header("Location: ../circuit_times.html?circuit=$circuit_id&error=formato_tiempo_invalido");
    exit;
}

$minutes = intval($matches[1]);
$seconds = intval($matches[2]);
$milliseconds = intval($matches[3]);

// Validar rangos
if ($minutes > 99 || $seconds > 59 || $milliseconds > 999) {
    header("Location: ../tiemposcircuito.html?circuit=$circuit_id&error=tiempo_fuera_rango");
    exit;
}

// Validar fecha
if (strtotime($fecha) > strtotime('today')) {
    header("Location: ../tiemposcircuito.html?circuit=$circuit_id&error=fecha_futura");
    exit;
}

try {
    // Verificar que el circuito existe
    $stmt = $pdo->prepare("SELECT nombre FROM Circuitos WHERE id = ?");
    $stmt->execute([$circuit_id]);
    $circuit = $stmt->fetch();
    
    if (!$circuit) {
        header("Location: ../tiemposcircuito.html?circuit=$circuit_id&error=circuito_no_encontrado");
        exit;
    }
    
    // Convertir tiempo a formato TIME de MySQL (HH:MM:SS)
    $time_mysql = sprintf('%02d:%02d:%02d', 0, $minutes, $seconds);
    
    // Usar el procedimiento almacenado para agregar tiempo
    $stmt = $pdo->prepare("CALL AgregarTiempos(?, ?, ?, ?)");
    $stmt->execute([getCurrentUserId(), $circuit_id, $time_mysql, $fecha]);
    
    // Registrar auditoría
    $detalle = sprintf('Se registró tiempo %s en %s con %s', $tiempo, $circuit['nombre'], $vehiculo);
    logAuditoria($pdo, getCurrentUserId(), 'INSERT', 'Tiempos', $detalle);
    
    // Redirigir con éxito
    header("Location: ../tiemposcircuito.html?circuit=$circuit_id&success=tiempo_registrado");
    exit;
    
} catch(PDOException $e) {
    error_log("Error agregando tiempo: " . $e->getMessage());
    header("Location: ../tiemposcircuito.html?circuit=$circuit_id&error=error_servidor");
    exit;
}
?>