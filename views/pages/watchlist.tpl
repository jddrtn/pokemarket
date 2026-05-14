{extends file="layout/main.tpl"}

{block name="body"}

<section class="py-5">

    <div class="container">

        <div class="mb-4">

            <h1 class="fw-bold mb-1">
                My Watchlist
            </h1>

            <p class="text-secondary mb-0">
                Your saved Pokémon cards
            </p>

        </div>

        {if isset($watchlist_cards) && $watchlist_cards|@count > 0}

            <div class="row g-4">

                {foreach from=$watchlist_cards item=card}

                    <div class="col-sm-6 col-xl-3">

                        <article class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">

                            <img
                                src="{$card.images.small}"
                                alt="{$card.name}"
                                class="pokemon-card-image"
                            >

                            <div class="card-body">

                                <p class="text-secondary small mb-2">
                                    {$card.set.name}
                                </p>

                                <h2 class="h5">
                                    {$card.name}
                                </h2>

                                <p class="text-secondary mb-3">
                                    Card #{$card.number}
                                </p>

                                <div class="d-flex flex-column gap-2">

                                    <a
                                        href="index.php?p=card&id={$card.id}"
                                        class="btn btn-dark"
                                    >
                                        View Card
                                    </a>

                                    <a
                                        href="index.php?p=remove-watchlist&id={$card.watchlist_id}"
                                        class="btn btn-outline-danger"
                                    >
                                        Remove from Watchlist
                                    </a>

                                </div>

                            </div>

                        </article>

                    </div>

                {/foreach}

            </div>

        {else}

            <div class="alert alert-light border mb-0">

                You have not added any cards to your watchlist yet.

            </div>

        {/if}

    </div>

</section>

{/block}