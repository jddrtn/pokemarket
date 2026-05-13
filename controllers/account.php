<?php

if(!isset($_SESSION['is_loggedin'])) {

    header("Location: index.php?p=login");
    exit();

}

// Gets user data
$user_data = $_SESSION['user_data'];

// Sends to Smarty
$Smarty->assign('user_data', $user_data);

?>