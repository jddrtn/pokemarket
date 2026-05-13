<?php

// Redirect guests
if(!isset($_SESSION['is_loggedin'])) {



    header("Location: index.php?p=login");
    exit();
}

// Requires card id
if(!isset($_GET['card_id'])) {

    header("Location: index.php?p=watchlist");
    exit();
}

// Creates watchlist object
$Watchlist = new Watchlist($Conn);

$user_id = $_SESSION['user_data']['user_id'];

$card_id = $_GET['card_id'];

// Removes card
$Watchlist->removeFromWatchlist($user_id, $card_id);

// Redirects back
header("Location: index.php?p=watchlist");
exit();

?>