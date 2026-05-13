<?php

// Creates User object
$User = new User($Conn);

// Stores messages
$login_error = "";
$register_error = "";
$success = "";

// Login

if(isset($_POST['login'])) {

    $email = trim($_POST['login_email']);
    $password = trim($_POST['login_password']);

    $result = $User->loginUser($email, $password);

    if($result === true) {

        header("Location: index.php?p=account");
        exit();

    } else {

        $login_error = $result;

    }
}

// REGISTER

if(isset($_POST['register'])) {

    $email = trim($_POST['register_email']);
    $password = trim($_POST['register_password']);
    $confirm_password = trim($_POST['register_password_confirm']);

    // Checks passwords match
    if($password !== $confirm_password) {

        $register_error = "Passwords do not match.";

    } else {

        $result = $User->createUser([
            'email' => $email,
            'password' => $password
        ]);

        if($result === true) {

            $success = "Account created successfully.";

        } else {

            $register_error = $result;

        }
    }
}

// Sends data to Smarty
$Smarty->assign('login_error', $login_error);
$Smarty->assign('register_error', $register_error);
$Smarty->assign('success', $success);

?>