<?php
define("HOME", "http://127.0.0.1/worldskill/car");

if (isset($_GET['action'])) {
    $action = $_GET['action'];
    var_dump($action);
}
