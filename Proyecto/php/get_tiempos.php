<?php
require_once 'config.php';

// Obtener parámetros
$id_circuito = '';
$orden = 'mejor';

if (isset($_GET['circuit'])) {
    $id_circuito = $_GET['circuit'];
}

if (isset($_GET['order'])) {
    $orden = $_GET['order'];
}

// Si no hay ID de circuito, no se puede continuar
if ($id_circuito == '') {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'No hay circuito']);
    exit;
}

// Buscar nombre del circuito
$sql = "SELECT nombre FROM Circuitos WHERE id = ?";
$consulta = $conexion->prepare($sql);
$consulta->execute([$id_circuito]);
$circuito = $consulta->fetch();

// Decidir orden
if ($orden == 'mejor') {
    $orden_sql = 'ASC';
} else {
    $orden_sql = 'DESC';
}

// Buscar tiempos
$sql = "SELECT t.id, t.tiempo, t.fecha, t.milisegundos, t.tiempo_completo, t.vehiculo, u.nombre as username 
        FROM Tiempos t 
        JOIN Usuarios u ON t.usuario_id = u.id 
        WHERE t.circuito_id = ? 
        ORDER BY t.tiempo $orden_sql";

$consulta = $conexion->prepare($sql);
$consulta->execute([$id_circuito]);
$tiempos = $consulta->fetchAll();

// Organizar por vehículo
$tiempos_por_vehiculo = [
    'Kart Rotax' => [],
    'Kart alquiler 390cc' => [],
    'moto' => []
];

// Procesar cada tiempo
foreach ($tiempos as $tiempo) {
    // Usar tiempo completo
    $tiempo_texto = $tiempo['tiempo_completo'];
    
    // Organizar datos
    $tiempo_formateado = [
        'id' => $tiempo['id'],
        'username' => $tiempo['username'],
        'tiempo_texto' => $tiempo_texto,
        'fecha' => $tiempo['fecha']
    ];
    
    // Agregar al vehículo
    $vehiculo = $tiempo['vehiculo'];
    $tiempos_por_vehiculo[$vehiculo][] = $tiempo_formateado;
}

// Preparar respuesta
$respuesta = [
    'circuit_name' => $circuito['nombre'],
    'times_by_vehicle' => $tiempos_por_vehiculo
];

// Enviar JSON
responder_json($respuesta);
?>