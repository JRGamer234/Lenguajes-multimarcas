<?php
require_once 'config.php';

// Guardar auditoría si está logueado
if (esta_logueado()) {
    guardar_auditoria($conexion, obtener_id_usuario(), 'LOGOUT', 'Usuarios', 'Usuario cerró sesión');
}

// Cerrar sesión
session_destroy();

// Ir al login
header('Location: ../login.html?success=sesion_cerrada');
?>