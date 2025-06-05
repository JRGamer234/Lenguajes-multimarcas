<?php
require_once 'config.php';

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
    
    // Obtener tiempos con información del usuario y vehículo real
    $orderBy = ($order === 'mejor') ? 'ASC' : 'DESC';
    
    $stmt = $pdo->prepare("
        SELECT 
            t.id,
            t.tiempo,
            t.fecha,
            t.milisegundos,
            t.tiempo_completo,
            t.vehiculo,
            u.nombre as username
        FROM Tiempos t
        JOIN Usuarios u ON t.usuario_id = u.id
        WHERE t.circuito_id = ?
        ORDER BY t.tiempo $orderBy, t.milisegundos ASC
    ");
    $stmt->execute([$circuit_id]);
    $times = $stmt->fetchAll();
    
    // Inicializar arrays para cada tipo de vehículo
    $times_by_vehicle = [
        'Kart Rotax' => [],
        'Kart alquiler 390cc' => [],
        'moto' => []
    ];
    
    foreach ($times as $time) {
        // Usar el tiempo_completo si está disponible, sino convertir desde tiempo + milisegundos
        if (!empty($time['tiempo_completo'])) {
            $tiempo_texto = $time['tiempo_completo'];
        } else {
            // Convertir tiempo de MySQL a formato mm:ss:ddd
            $time_parts = explode(':', $time['tiempo']);
            $hours = intval($time_parts[0]);
            $minutes = intval($time_parts[1]);
            $seconds = intval($time_parts[2]);
            
            $total_minutes = ($hours * 60) + $minutes;
            $milisegundos = $time['milisegundos'] ?? 0;
            $tiempo_texto = sprintf('%d:%02d:%03d', $total_minutes, $seconds, $milisegundos);
        }
        
        // Calcular tiempo en segundos para ordenación
        $time_parts = explode(':', $tiempo_texto);
        $total_seconds = 0;
        if (count($time_parts) >= 3) {
            $minutes = intval($time_parts[0]);
            $seconds = intval($time_parts[1]);
            $milisegundos = intval($time_parts[2]);
            $total_seconds = ($minutes * 60) + $seconds + ($milisegundos / 1000);
        }
        
        $formatted_time = [
            'id' => $time['id'],
            'username' => $time['username'],
            'tiempo_texto' => $tiempo_texto,
            'fecha' => $time['fecha'],
            'tiempo_segundos' => $total_seconds
        ];
        
        // Usar el vehículo real de la base de datos
        $vehiculo = $time['vehiculo'];
        
        // Asegurarse de que el vehículo esté en nuestras categorías
        if (array_key_exists($vehiculo, $times_by_vehicle)) {
            $times_by_vehicle[$vehiculo][] = $formatted_time;
        }
    }
    
    // Ordenar cada categoría por tiempo
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