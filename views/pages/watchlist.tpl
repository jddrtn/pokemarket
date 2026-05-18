{extends file="layout/main.tpl"}

{block name="body"}

<!-- Watchlist page section -->
<section class="py-5">

    <div class="container">

        <!-- Page heading -->
        <div class="mb-4">

            <h1 class="fw-bold mb-1">
                My Watchlist
            </h1>

            <p class="text-secondary mb-0">
                Your saved Pokémon cards
            </p>

        </div>

        <!-- Check if user has saved cards -->
        {if isset($watchlist_cards) && $watchlist_cards|@count > 0}

            <!-- Watchlist card grid -->
            <div class="row g-4">

                <!-- Loop through each saved card -->
                {foreach from=$watchlist_cards item=card}

                    <div class="col-sm-6 col-xl-3">

                        <!-- Individual card -->
                        <article class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">

                            <!-- Card image -->
                            <img
                                src="{$card.images.small}"
                                alt="{$card.name}"
                                class="pokemon-card-image"
                            >

                            <!-- Card body -->
                            <div class="card-body d-flex flex-column">

                                <!-- Set name -->
                                <p class="text-secondary small mb-2">
                                    {$card.set.name}
                                </p>

                                <!-- Card name -->
                                <h2 class="h5">
                                    {$card.name}
                                </h2>

                                <!-- Card number -->
                                <p class="text-secondary mb-3">
                                    Card #{$card.number}
                                </p>

                                <!-- Buttons aligned to bottom -->
                                <div class="mt-auto d-flex flex-column gap-2">

                                    <!-- View card button -->
                                    <a href="index.php?p=card&id={$card.id}" class="btn btn-dark">
                                        View Card
                                    </a>

                                    <!-- Remove from watchlist button -->
                                    <a href="index.php?p=remove-watchlist&id={$card.watchlist_id}" class="btn btn-dark">
                                        Remove from Watchlist
                                    </a>

                                </div>

                            </div>

                        </article>

                    </div>

                {/foreach}

            </div>

        {else}

            <!-- Empty watchlist state -->
            <div class="text-center py-5">

                <!-- Empty icon -->
                <div class="mb-4">

                    <i class="fa-regular fa-star fs-1 text-secondary"></i>

                </div>

                <!-- Empty message -->
                <h2 class="h3 mb-3">
                    Your watchlist is empty
                </h2>

                <p class="text-secondary mb-4">
                    Start saving Pokémon cards to track them later.
                </p>

                <!-- Browse cards button -->
                <a href="index.php?p=cards" class="btn btn-dark">
                    Browse Cards
                </a>

            </div>

        {/if}

    </div>

</section>

{/block}