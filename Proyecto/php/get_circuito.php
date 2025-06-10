<?php
require_once 'config.php';

// Verificar si pidieron un circuito específico
$id_circuito = '';
if (isset($_GET['id'])) {
    $id_circuito = $_GET['id'];
}

if ($id_circuito != '') {
    // Buscar circuito específico
    $sql = "SELECT id, nombre, ubicacion, longitud FROM Circuitos WHERE id = ?";
    $consulta = $conexion->prepare($sql);
    $consulta->execute([$id_circuito]);
    $circuito = $consulta->fetch();
    
    // Devolver circuito
    header('Content-Type: application/json');
    echo json_encode($circuito);
    
} else {
    // Devolver todos los circuitos
    $sql = "SELECT id, nombre FROM Circuitos ORDER BY nombre";
    $consulta = $conexion->prepare($sql);
    $consulta->execute();
    $circuitos = $consulta->fetchAll();
    
    // Devolver circuitos
    header('Content-Type: application/json');
    echo json_encode($circuitos);
}
?>