<?php
require_once 'config.php';

if (!checkAuth()) {
    jsonResponse(['error' => 'No autorizado'], 401);
}

$circuit_id = $_GET['circuit'] ?? null;
$order = $_GET['order'] ?? 'mejor';

if (!$circuit_id) {
    jsonResponse(['error' => 'ID de circuito requerido'], 400);
}

try {
    // Obtener nombre del circuito
    $stmt = $pdo->prepare("SELECT nombre FROM Circuitos WHERE id = ?");
    $stmt->execute([$circuit_id]);
    $circuit = $stmt->fetch();
    
    if (!$circuit) {
        jsonResponse(['error' => 'Circuito no encontrado'], 404);
    }
    
    // Obtener tiempos con información del usuario
    // Como no tienes campo vehiculo en la tabla Tiempos, usaremos categorías ficticias basadas en los tiempos
    $orderBy = ($order === 'mejor') ? 'ASC' : 'DESC';
    
    $stmt = $pdo->prepare("
        SELECT 
            t.id,
            t.tiempo,
            t.fecha,
            u.nombre as username,
            CASE 
                WHEN TIME_TO_SEC(t.tiempo) < 60 THEN 'Kart Rotax'
                WHEN TIME_TO_SEC(t.tiempo) < 120 THEN 'Kart alquiler 390cc'
                ELSE 'moto'
            END as vehiculo_categoria
        FROM Tiempos t
        JOIN Usuarios u ON t.usuario_id = u.id
        WHERE t.circuito_id = ?
        ORDER BY t.tiempo $orderBy
    ");
    $stmt->execute([$circuit_id]);
    $times = $stmt->fetchAll();
    
    // Agrupar por categoría de vehículo y formatear tiempos
    $times_by_vehicle = [
        'Kart Rotax' => [],
        'Kart alquiler 390cc' => [],
        'moto' => []
    ];
    
    foreach ($times as $time) {
        // Convertir tiempo de MySQL a formato mm:ss:ddd
        $time_parts = explode(':', $time['tiempo']);
        $hours = intval($time_parts[0]);
        $minutes = intval($time_parts[1]);
        $seconds = intval($time_parts[2]);
        
        $total_minutes = ($hours * 60) + $minutes;
        $tiempo_texto = sprintf('%d:%02d:%03d', $total_minutes, $seconds, 0); // Asumiendo 0 milisegundos
        
        $formatted_time = [
            'id' => $time['id'],
            'username' => $time['username'],
            'tiempo_texto' => $tiempo_texto,
            'fecha' => $time['fecha'],
            'tiempo_segundos' => ($total_minutes * 60) + $seconds
        ];
        
        $vehiculo = $time['vehiculo_categoria'];
        $times_by_vehicle[$vehiculo][] = $formatted_time;
    }
    
    // Ordenar cada categoría
    foreach ($times_by_vehicle as $vehiculo => &$times_list) {
        if ($order === 'mejor') {
            usort($times_list, function($a, $b) {
                return $a['tiempo_segundos'] <=> $b['tiempo_segundos'];
            });
        } else {
            usort($times_list, function($a, $b) {
                return $b['tiempo_segundos'] <=> $a['tiempo_segundos'];
            });
        }
    }
    
    $response = [
        'circuit_name' => $circuit['nombre'],
        'times_by_vehicle' => $times_by_vehicle
    ];
    
    jsonResponse($response);
    
} catch(PDOException $e) {
    error_log("Error obteniendo tiempos: " . $e->getMessage());
    jsonResponse(['error' => 'Error del servidor'], 500);
}
?>