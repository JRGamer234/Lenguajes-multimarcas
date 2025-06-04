<?php
require_once 'config.php';

if (!checkAuth()) {
    header('Location: ../login.html');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../add_circuit.html');
    exit;
}

$circuit_name = trim($_POST['circuit_name'] ?? '');

if (empty($circuit_name)) {
    header('Location: ../add_circuit.html?error=nombre_vacio');
    exit;
}

if (strlen($circuit_name) < 2) {
    header('Location: ../add_circuit.html?error=nombre_corto');
    exit;
}

if (strlen($circuit_name) > 50) {
    header('Location: ../add_circuit.html?error=nombre_largo');
    exit;
}

// Validar caracteres permitidos
if (!preg_match('/^[a-zA-Z0-9\s\-_áéíóúñÁÉÍÓÚÑ]+$/', $circuit_name)) {
    header('Location: ../add_circuit.html?error=caracteres_invalidos');
    exit;
}

try {
    // Verificar si el circuito ya existe
    $stmt = $pdo->prepare("SELECT id FROM Circuitos WHERE nombre = ?");
    $stmt->execute([$circuit_name]);
    
    if ($stmt->fetch()) {
        header('Location: ../add_circuit.html?error=circuito_existe');
        exit;
    }
    
    // Usar el procedimiento almacenado para agregar circuito
    // Valores por defecto para ubicación y longitud
    $ubicacion = 'Por definir';
    $longitud = 1.00;
    
    $stmt = $pdo->prepare("CALL AgregarCircuito(?, ?, ?)");
    $stmt->execute([$circuit_name, $ubicacion, $longitud]);
    
    // Registrar auditoría
    logAuditoria($pdo, getCurrentUserId(), 'INSERT', 'Circuitos', 'Se agregó el circuito: ' . $circuit_name);
    
    // Redirigir con éxito
    header('Location: ../circuit_list.html?success=circuito_agregado');
    exit;
    
} catch(PDOException $e) {
    error_log("Error agregando circuito: " . $e->getMessage());
    header('Location: ../add_circuit.html?error=error_servidor');
    exit;
}
?>