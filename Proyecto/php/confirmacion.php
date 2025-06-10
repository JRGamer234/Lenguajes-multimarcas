<?php
require_once 'config.php';

// Crear respuesta
$respuesta = [
    'authenticated' => esta_logueado(),
    'user_id' => obtener_id_usuario(),
    'username' => obtener_nombre_usuario()
];

// Enviar JSON
responder_json($respuesta);
?>