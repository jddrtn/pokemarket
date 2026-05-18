<?php

// Shows all PHP errors
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Loads boot file
require_once(__DIR__ . '/includes/boot.include.php');

// Gets page name
$page = $_GET['p'] ?? 'home';

// Sends page name to Smarty
$Smarty->assign('view_name', $page);

// Controller path
$controller_path = __DIR__ . '/controllers/' . $page . '.php';

// Loads controller if it exists
if(file_exists($controller_path)) {
    require_once($controller_path);
}

// Displays Smarty template
$Smarty->display('pages/' . $page . '.tpl');

// Pages that require login
$secure_pages = array(
    'account',
    'watchlist',
    'change-password'
);