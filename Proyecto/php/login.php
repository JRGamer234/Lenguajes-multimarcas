<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../login.html');
    exit;
}

$username = trim($_POST['username'] ?? '');
$password = trim($_POST['password'] ?? '');

if (empty($username) || empty($password)) {
    header('Location: ../login.html?error=campos_vacios');
    exit;
}

try {
    // Buscar usuario en la base de datos
    $stmt = $pdo->prepare("SELECT id, nombre, contrasena FROM Usuarios WHERE nombre = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    
    if ($user && $password === $user['contrasena']) {
        // Login exitoso
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['nombre'];
        
        // Registrar auditoría
        logAuditoria($pdo, $user['id'], 'LOGIN', 'Usuarios', 'Usuario inició sesión');
        
        // Redirigir al menú principal
        header('Location: ../dashboard.html?user=' . urlencode($user['nombre']));
        exit;
    } else {
        // Login fallido
        header('Location: ../login.html?error=credenciales_incorrectas');
        exit;
    }
    
} catch(PDOException $e) {
    error_log("Error en login: " . $e->getMessage());
    header('Location: ../login.html?error=error_servidor');
    exit;
}
?>