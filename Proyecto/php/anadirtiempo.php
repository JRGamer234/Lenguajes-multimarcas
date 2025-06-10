<?php
require_once 'config.php';

// Obtener datos del formulario
$id_circuito = $_POST['circuit_id'];
$tiempo = $_POST['tiempo'];
$vehiculo = $_POST['vehiculo'];
$fecha = $_POST['fecha'];

// Separar tiempo en partes (mm:ss:ddd)
$partes = explode(':', $tiempo);
$minutos = $partes[0];
$segundos = $partes[1];
$milisegundos = $partes[2];

// Crear tiempo para MySQL
$tiempo_mysql = "00:" . sprintf('%02d:%02d', $minutos, $segundos);

// Obtener ID del usuario
$id_usuario = obtener_id_usuario();

// Guardar tiempo
$sql = "INSERT INTO Tiempos (usuario_id, circuito_id, tiempo, fecha, milisegundos, tiempo_completo, vehiculo) VALUES (?, ?, ?, ?, ?, ?, ?)";
$consulta = $conexion->prepare($sql);
$consulta->execute([$id_usuario, $id_circuito, $tiempo_mysql, $fecha, $milisegundos, $tiempo, $vehiculo]);

// Guardar auditoría
$detalle = "Tiempo: $tiempo, Vehiculo: $vehiculo";
guardar_auditoria($conexion, obtener_id_usuario(), 'INSERT', 'Tiempos', $detalle);

// Regresar al circuito
header("Location: ../tiemposcircuito.html?circuit=$id_circuito");
?>