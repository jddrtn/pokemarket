<?php

// Redirect guests
if (!isset($_SESSION['is_loggedin'])) {

    header("Location: index.php?p=login");
    exit();
}

$Watchlist = new Watchlist($Conn);

$user_id = $_SESSION['user_data']['user_id'];

$watchlist = $Watchlist->getUserWatchlist($user_id);

// Array to hold card data
$watchlist_cards = [];

foreach ($watchlist as $item) {

    $card_id = $item['card_id'];

    // Pokémon TCG API request
    $api_url = "https://api.pokemontcg.io/v2/cards/" . urlencode($card_id);

    $response = @file_get_contents($api_url);

    if ($response) {

        $result = json_decode($response, true);

        if (isset($result['data'])) {

            $card = $result['data'];

            // Include DB watchlist ID for remove button
            $card['watchlist_id'] = $item['watchlist_id'];

            $watchlist_cards[] = $card;
        }
    }
}

$Smarty->assign('watchlist_cards', $watchlist_cards);

?>