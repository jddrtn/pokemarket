<?php


$User = new User($Conn);


$login_error = "";
$register_error = "";
$success = "";

// Login

if(isset($_POST['login'])) {

    $email = trim($_POST['login_email']);
    $password = trim($_POST['login_password']);

    $result = $User->loginUser($email, $password);

    if($result === true) {

        // Redirects to homepage
        header("Location: index.php");
        exit();

    } else {

        $login_error = $result;

    }
}

// Register

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


$Smarty->assign('login_error', $login_error);
$Smarty->assign('register_error', $register_error);
$Smarty->assign('success', $success);

?>