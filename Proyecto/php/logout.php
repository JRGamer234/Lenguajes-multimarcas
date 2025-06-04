<?php
require_once 'config.php';

if (checkAuth()) {
    // Registrar auditoría de logout
    logAuditoria($pdo, getCurrentUserId(), 'LOGOUT', 'Usuarios', 'Usuario cerró sesión');
}

// Destruir la sesión
session_destroy();

// Redirigir al login
header('Location: ../login.html?success=sesion_cerrada');
exit;
?>