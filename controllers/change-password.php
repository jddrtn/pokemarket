<?php

// Redirect users who are not logged in
if(!isset($_SESSION['is_loggedin'])) {

    header("Location: index.php?p=login");
    exit();
}

// Create User object
$User = new User($Conn);

// Messages
$error = "";
$success = "";

// Handle form submission
if(isset($_POST['change_password'])) {

    $current_password = trim($_POST['current_password']);
    $new_password = trim($_POST['new_password']);
    $confirm_password = trim($_POST['confirm_password']);

    // Check passwords match
    if($new_password !== $confirm_password) {

        $error = "New passwords do not match.";

    } else {

        $user_id = $_SESSION['user_data']['user_id'];

        $result = $User->changePassword(
            $user_id,
            $current_password,
            $new_password
        );

        if($result === true) {

            $success = "Password changed successfully.";

        } else {

            $error = $result;

        }
    }
}

// Send messages to Smarty
$Smarty->assign('error', $error);
$Smarty->assign('success', $success);

?>