<?php


session_start();

// Shows errors temporarily
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


require_once(__DIR__ . '/../vendor/autoload.php');


require_once(__DIR__ . '/config.include.php');
require_once(__DIR__ . '/db.include.php');
require_once(__DIR__ . '/autoloader.include.php');


$Smarty = new Smarty\Smarty();


$Smarty->setTemplateDir(__DIR__ . '/../views');
$Smarty->setCompileDir(__DIR__ . '/../smarty/templates_c');
$Smarty->setCacheDir(__DIR__ . '/../smarty/cache');
$Smarty->setConfigDir(__DIR__ . '/../smarty/configs');

?>