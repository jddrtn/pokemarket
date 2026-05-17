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

    // Trim user input
    $email = trim($_POST['register_email']);
    $password = trim($_POST['register_password']);
    $confirm_password = trim($_POST['register_password_confirm']);

    // Validate email format
    if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {

        $register_error = "Please enter a valid email address.";

    // Minimum password length
    } elseif(strlen($password) < 8) {

    $register_error = "Password must be at least 8 characters long.";

    // Password strength requirements
    } elseif(
    !preg_match('/[A-Z]/', $password) ||
    !preg_match('/[0-9]/', $password) ||
    !preg_match('/[\W]/', $password)
    ) {

    $register_error = "Password must include an uppercase letter, number, and special character.";

// Check passwords match
} elseif($password !== $confirm_password) {

        $register_error = "Passwords do not match.";

    } else {

        // Attempt account creation
        $result = $User->createUser([
            'email' => $email,
            'password' => $password
        ]);

        // Successful registration
        if($result === true) {

            $success = "Account created successfully.";

        } else {

            // Show returned error
            $register_error = $result;

        }
    }
}

// Sends data to Smarty
$Smarty->assign('login_error', $login_error);
$Smarty->assign('register_error', $register_error);
$Smarty->assign('success', $success);

?>