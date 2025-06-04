<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../delete_circuit.html');
    exit;
}

$circuit_id = $_POST['circuit_id'] ?? '';

if (empty($circuit_id)) {
    header('Location: ../delete_circuit.html');
    exit;
}

try {
    // Obtener información del circuito
    $stmt = $pdo->prepare("SELECT nombre FROM Circuitos WHERE id = ?");
    $stmt->execute([$circuit_id]);
    $circuit = $stmt->fetch();
    
    if (!$circuit) {
        header('Location: ../delete_circuit.html');
        exit;
    }
    
    $circuit_name = $circuit['nombre'];
    
    // Eliminar tiempos asociados si existen
    $stmt = $pdo->prepare("DELETE FROM Tiempos WHERE circuito_id = ?");
    $stmt->execute([$circuit_id]);
    
    // Eliminar el circuito
    $stmt = $pdo->prepare("DELETE FROM Circuitos WHERE id = ?");
    $stmt->execute([$circuit_id]);
    
    // Registrar auditoría
    if (getCurrentUserId()) {
        logAuditoria($pdo, getCurrentUserId(), 'DELETE', 'Circuitos', 'Se eliminó el circuito: ' . $circuit_name);
    }
    
} catch(PDOException $e) {
    error_log("Error eliminando circuito: " . $e->getMessage());
}

// Siempre redirigir a la lista de circuitos
header('Location: ../circuit_list.html');
exit;
?>