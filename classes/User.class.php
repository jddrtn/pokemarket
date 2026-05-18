<?php

class User {

    protected $Conn;

    // Constructor
    public function __construct($Conn) {
        $this->Conn = $Conn;
    }

    // Creates a new user account
    public function createUser($user_data) {

        // Checks if email already exists
        $query = "
            SELECT *
            FROM users
            WHERE user_email = :email
        ";

        $stmt = $this->Conn->prepare($query);

        $stmt->execute([
            'email' => $user_data['email']
        ]);

        // Stops duplicate accounts
        if($stmt->rowCount() > 0) {
            return "Email already exists.";
        }

        // Hashes password securely
        $secure_password = password_hash(
            $user_data['password'],
            PASSWORD_DEFAULT
        );

        // Inserts user into database
        $query = "
            INSERT INTO users
            (user_email, user_pass)
            VALUES
            (:email, :password)
        ";

        $stmt = $this->Conn->prepare($query);

        $success = $stmt->execute([
            'email' => $user_data['email'],
            'password' => $secure_password
        ]);

        // Returns success
        if($success) {
            return true;
        }

        return "Registration failed.";
    }

    // Logs user in
    public function loginUser($email, $password) {

        $query = "
            SELECT *
            FROM users
            WHERE user_email = :email
        ";

        $stmt = $this->Conn->prepare($query);

        $stmt->execute([
            'email' => $email
        ]);

        $attempt = $stmt->fetch(PDO::FETCH_ASSOC);

        // Verifies hashed password
        if($attempt && password_verify($password, $attempt['user_pass'])) {

            $_SESSION['is_loggedin'] = true;

            $_SESSION['user_data'] = [
                'user_id' => $attempt['user_id'],
                'user_email' => $attempt['user_email']
            ];

            return true;
        }

        return "Invalid email or password.";
    }


    // Changes user password
public function changePassword($user_id, $current_password, $new_password) {

    // Get current user
    $query = "
        SELECT *
        FROM users
        WHERE user_id = :user_id
    ";

    $stmt = $this->Conn->prepare($query);

    $stmt->execute([
        'user_id' => $user_id
    ]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verify current password
    if(!$user || !password_verify($current_password, $user['user_pass'])) {

        return "Current password is incorrect.";
    }

    // Password strength validation
    if(strlen($new_password) < 8) {
        return "Password must be at least 8 characters.";
    }

    if(!preg_match('/[A-Z]/', $new_password)) {
        return "Password must include an uppercase letter.";
    }

    if(!preg_match('/[0-9]/', $new_password)) {
        return "Password must include a number.";
    }

    if(!preg_match('/[\W]/', $new_password)) {
        return "Password must include a special character.";
    }

    // Hash new password
    $secure_password = password_hash(
        $new_password,
        PASSWORD_DEFAULT
    );

    // Update password
    $query = "
        UPDATE users
        SET user_pass = :password
        WHERE user_id = :user_id
    ";

    $stmt = $this->Conn->prepare($query);

    $success = $stmt->execute([
        'password' => $secure_password,
        'user_id' => $user_id
    ]);

    if($success) {
        return true;
    }

    return "Unable to change password.";
}
}
?>