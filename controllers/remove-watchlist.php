<?php

if (!isset($_SESSION['is_loggedin'])) {

    header("Location: index.php?p=login");
    exit();
}

if (!isset($_GET['id'])) {

    header("Location: index.php?p=watchlist");
    exit();
}

$Watchlist = new Watchlist($Conn);

$Watchlist->removeFromWatchlist(
    $_GET['id'],
    $_SESSION['user_data']['user_id']
);

header("Location: index.php?p=watchlist");
exit();

?>