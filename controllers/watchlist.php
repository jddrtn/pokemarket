<?php

// Redirect guests
if(!isset($_SESSION['is_loggedin'])) {

    header("Location: index.php?p=login");
    exit();
}

$Watchlist = new Watchlist($Conn);
$user_id = $_SESSION['user_data']['user_id'];
$watchlist = $Watchlist->getUserWatchlist($user_id);
$Smarty->assign('watchlist', $watchlist);

?>