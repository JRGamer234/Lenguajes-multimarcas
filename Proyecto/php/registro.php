<?php
require_once 'config.php';

// Obtener datos del formulario
$usuario = $_POST['username'];
$password = $_POST['password'];

// Crear usuario
$sql = "CALL AgregarUsuarios(?, ?)";
$consulta = $conexion->prepare($sql);
$consulta->execute([$usuario, $password]);

// Obtener ID del nuevo usuario
$sql = "SELECT id FROM Usuarios WHERE nombre = ?";
$consulta = $conexion->prepare($sql);
$consulta->execute([$usuario]);
$nuevo_usuario = $consulta->fetch();

// Guardar auditoría
guardar_auditoria($conexion, $nuevo_usuario['id'], 'INSERT', 'Usuarios', 'Se creó el usuario ' . $usuario);

// Ir al login
header('Location: ../login.html?success=registro_exitoso');
?>