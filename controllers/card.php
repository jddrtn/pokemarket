<?php

$card_saved = false;

if (isset($_SESSION['is_loggedin']) && isset($_GET['id'])) {

    $Watchlist = new Watchlist($Conn);

    $card_saved = $Watchlist->cardExists(
        $_SESSION['user_data']['user_id'],
        $_GET['id']
    );
}

$Smarty->assign('card_saved', $card_saved);

?>