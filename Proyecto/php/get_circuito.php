<?php
// Mostrar errores para debug
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Incluir configuración
require_once 'config.php';

// Debug: mostrar información si se accede directamente
if (!empty($_GET['debug'])) {
    echo "<h2>Debug - get_circuito.php</h2>";
    echo "Conexión PDO: " . (isset($pdo) ? "OK" : "Error") . "<br>";
}

try {
    // Consulta directa sin procedimiento almacenado
    $stmt = $pdo->prepare("SELECT id, nombre, ubicacion, longitud FROM Circuitos ORDER BY nombre");
    $stmt->execute();
    $circuits = $stmt->fetchAll();
    
    // Si no hay circuitos, devolver array vacío
    if (!$circuits) {
        $circuits = [];
    }
    
    // Debug información si se solicita
    if (!empty($_GET['debug'])) {
        echo "Circuitos encontrados: " . count($circuits) . "<br>";
        echo "JSON que se enviará:<br>";
        echo "<pre>" . json_encode($circuits, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "</pre>";
        exit;
    }
    
    // Respuesta JSON normal
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($circuits, JSON_UNESCAPED_UNICODE);
    
} catch(PDOException $e) {
    // En caso de error, devolver JSON con error
    $error = [
        'error' => true,
        'message' => 'Error del servidor: ' . $e->getMessage(),
        'code' => $e->getCode()
    ];
    
    if (!empty($_GET['debug'])) {
        echo "Error PDO: " . $e->getMessage() . "<br>";
        echo "Código: " . $e->getCode() . "<br>";
        exit;
    }
    
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    echo json_encode($error, JSON_UNESCAPED_UNICODE);
}
?>