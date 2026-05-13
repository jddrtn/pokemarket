<?php

class Watchlist {

    protected $Conn;

    // Constructor
    public function __construct($Conn) {
        $this->Conn = $Conn;
    }

    // Adds card to watchlist
    public function addToWatchlist($user_id, $card_id) {

        // Prevent duplicates
        $query = "
            SELECT *
            FROM watchlist
            WHERE user_id = :user_id
            AND card_id = :card_id
        ";

        $stmt = $this->Conn->prepare($query);

        $stmt->execute([
            'user_id' => $user_id,
            'card_id' => $card_id
        ]);

        // Already exists
        if($stmt->rowCount() > 0) {
            return "Card already saved.";
        }

        // Insert card
        $query = "
            INSERT INTO watchlist
            (user_id, card_id)
            VALUES
            (:user_id, :card_id)
        ";

        $stmt = $this->Conn->prepare($query);

        $success = $stmt->execute([
            'user_id' => $user_id,
            'card_id' => $card_id
        ]);

        if($success) {
            return true;
        }

        return "Unable to save card.";
    }

    // Removes card from watchlist
    public function removeFromWatchlist($user_id, $card_id) {

        $query = "
            DELETE FROM watchlist
            WHERE user_id = :user_id
            AND card_id = :card_id
        ";

        $stmt = $this->Conn->prepare($query);

        return $stmt->execute([
            'user_id' => $user_id,
            'card_id' => $card_id
        ]);
    }

    // Gets all saved cards for user
    public function getUserWatchlist($user_id) {

        $query = "
            SELECT *
            FROM watchlist
            WHERE user_id = :user_id
            ORDER BY created_at DESC
        ";

        $stmt = $this->Conn->prepare($query);

        $stmt->execute([
            'user_id' => $user_id
        ]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Checks if card already saved
    public function cardExists($user_id, $card_id) {

        $query = "
            SELECT *
            FROM watchlist
            WHERE user_id = :user_id
            AND card_id = :card_id
        ";

        $stmt = $this->Conn->prepare($query);

        $stmt->execute([
            'user_id' => $user_id,
            'card_id' => $card_id
        ]);

        return $stmt->rowCount() > 0;
    }
}
?>
