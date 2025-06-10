<?php
// Conectar con la base de datos
$conexion = new PDO("mysql:host=localhost;dbname=laptimer", "root", "");

// Iniciar sesión
session_start();

// Función para saber si está logueado
function esta_logueado() {
    return isset($_SESSION['user_id']);
}

// Función para obtener ID del usuario
function obtener_id_usuario() {
    return $_SESSION['user_id'];
}

// Función para obtener nombre del usuario
function obtener_nombre_usuario() {
    return $_SESSION['username'];
}

// Función para guardar auditoría
function guardar_auditoria($conexion, $user_id, $accion, $tabla, $detalle) {
    $sql = "INSERT INTO Auditoria (usuario_id, accion, tabla_modificada, detalle) VALUES (?, ?, ?, ?)";
    $consulta = $conexion->prepare($sql);
    $consulta->execute([$user_id, $accion, $tabla, $detalle]);
}

// Función para responder JSON
function responder_json($datos) {
    header('Content-Type: application/json');
    echo json_encode($datos);
    exit;
}
?>