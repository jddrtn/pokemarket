<?php
// Redirect guests
if(!isset($_SESSION['is_loggedin'])) {

    header("Location: index.php?p=login");
    exit();
}

// Requires card id
if(!isset($_GET['card_id'])) {

    header("Location: index.php?p=cards");
    exit();
}

// Creates watchlist object
$Watchlist = new Watchlist($Conn);

$user_id = $_SESSION['user_data']['user_id'];

$card_id = $_GET['card_id'];

// Adds card
$Watchlist->addToWatchlist($user_id, $card_id);

// Redirects back to card page
header("Location: index.php?p=card&id=" . $card_id);
exit();

?>