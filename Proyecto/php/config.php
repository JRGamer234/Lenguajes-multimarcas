<?php
// Configuración de la base de datos para XAMPP
$host = 'localhost';
$dbname = 'laptimer';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}

// Iniciar sesión si no está iniciada
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Función para verificar si el usuario está logueado
function checkAuth() {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

// Función para obtener el ID del usuario actual
function getCurrentUserId() {
    return $_SESSION['user_id'] ?? null;
}

// Función para obtener el nombre del usuario actual
function getCurrentUsername() {
    return $_SESSION['username'] ?? null;
}

// Función para registrar auditoria
function logAuditoria($pdo, $usuario_id, $accion, $tabla_modificada, $detalle = '') {
    try {
        $stmt = $pdo->prepare("INSERT INTO Auditoria (usuario_id, accion, tabla_modificada, detalle) VALUES (?, ?, ?, ?)");
        $stmt->execute([$usuario_id, $accion, $tabla_modificada, $detalle]);
    } catch(PDOException $e) {
        error_log("Error en auditoría: " . $e->getMessage());
    }
}

// Función para responder JSON
function jsonResponse($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}
?>