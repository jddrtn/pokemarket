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
}
?>