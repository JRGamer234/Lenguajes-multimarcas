<?php
require_once 'config.php';

// Obtener ID del circuito
$id_circuito = $_POST['circuit_id'];

// Obtener nombre del circuito
$sql = "SELECT nombre FROM Circuitos WHERE id = ?";
$consulta = $conexion->prepare($sql);
$consulta->execute([$id_circuito]);
$circuito = $consulta->fetch();
$nombre_circuito = $circuito['nombre'];

// Eliminar tiempos del circuito
$sql = "DELETE FROM Tiempos WHERE circuito_id = ?";
$consulta = $conexion->prepare($sql);
$consulta->execute([$id_circuito]);

// Eliminar circuito
$sql = "DELETE FROM Circuitos WHERE id = ?";
$consulta = $conexion->prepare($sql);
$consulta->execute([$id_circuito]);

// Guardar auditoría
guardar_auditoria($conexion, obtener_id_usuario(), 'DELETE', 'Circuitos', 'Se eliminó el circuito: ' . $nombre_circuito);

// Ir a lista de circuitos
header('Location: ../circuit_list.html');
?>