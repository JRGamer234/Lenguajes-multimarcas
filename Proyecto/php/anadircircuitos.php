<?php
require_once 'config.php';

// Obtener nombre del circuito
$nombre_circuito = $_POST['circuit_name'];

// Crear circuito
$ubicacion = 'Por definir';
$longitud = 1.00;

$sql = "CALL AgregarCircuito(?, ?, ?)";
$consulta = $conexion->prepare($sql);
$consulta->execute([$nombre_circuito, $ubicacion, $longitud]);

// Guardar auditoría
guardar_auditoria($conexion, obtener_id_usuario(), 'INSERT', 'Circuitos', 'Se agregó el circuito: ' . $nombre_circuito);

// Ir a lista de circuitos
header('Location: ../circuit_list.html?success=circuito_agregado');
?>