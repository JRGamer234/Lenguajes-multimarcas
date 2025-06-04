<?php
require_once 'config.php';

$response = [
    'authenticated' => checkAuth(),
    'user_id' => getCurrentUserId(),
    'username' => getCurrentUsername()
];

jsonResponse($response);
?>