<?php
require_once 'config.php';

// Obtener datos del formulario
$usuario = $_POST['username'];
$password = $_POST['password'];

// Buscar usuario en la base de datos
$sql = "SELECT id, nombre, contrasena FROM Usuarios WHERE nombre = ?";
$consulta = $conexion->prepare($sql);
$consulta->execute([$usuario]);
$datos_usuario = $consulta->fetch();

// Verificar contraseña
if ($datos_usuario && $password == $datos_usuario['contrasena']) {
    // Guardar en sesión
    $_SESSION['user_id'] = $datos_usuario['id'];
    $_SESSION['username'] = $datos_usuario['nombre'];
    
    // Guardar auditoría
    guardar_auditoria($conexion, $datos_usuario['id'], 'LOGIN', 'Usuarios', 'Usuario inició sesión');
    
    // Ir al dashboard
    header('Location: ../dashboard.html?user=' . $datos_usuario['nombre']);
} else {
    // Error de login
    header('Location: ../login.html?error=credenciales_incorrectas');
}
?>