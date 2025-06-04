<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../registro.html');
    exit;
}

$username = trim($_POST['username'] ?? '');
$password = trim($_POST['password'] ?? '');

if (empty($username) || empty($password)) {
    header('Location: ../registro.html?error=campos_vacios');
    exit;
}

if (strlen($username) < 3) {
    header('Location: ../registro.html?error=usuario_corto');
    exit;
}

if (strlen($password) < 4) {
    header('Location: ../registro.html?error=password_corta');
    exit;
}

// Validar que el usuario solo contenga caracteres permitidos
if (!preg_match('/^[a-zA-Z0-9_]+$/', $username)) {
    header('Location: ../registro.html?error=caracteres_invalidos');
    exit;
}

try {
    // Verificar si el usuario ya existe
    $stmt = $pdo->prepare("SELECT id FROM Usuarios WHERE nombre = ?");
    $stmt->execute([$username]);
    
    if ($stmt->fetch()) {
        header('Location: ../registro.html?error=usuario_existe');
        exit;
    }
    
    // Usar el procedimiento almacenado para agregar usuario
    $stmt = $pdo->prepare("CALL AgregarUsuarios(?, ?)");
    $stmt->execute([$username, $password]);
    
    // Obtener el ID del usuario recién creado
    $stmt = $pdo->prepare("SELECT id FROM Usuarios WHERE nombre = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    
    if ($user) {
        // Registrar auditoría
        logAuditoria($pdo, $user['id'], 'INSERT', 'Usuarios', 'Se creó el usuario ' . $username);
    }
    
    // Redirigir al login con mensaje de éxito
    header('Location: ../login.html?success=registro_exitoso');
    exit;
    
} catch(PDOException $e) {
    error_log("Error en registro: " . $e->getMessage());
    header('Location: ../registro.html?error=error_servidor');
    exit;
}
?>