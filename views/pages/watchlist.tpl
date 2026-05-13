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

        {if isset($watchlist) && $watchlist|@count > 0}

            <div class="row g-4">

                {foreach from=$watchlist item=item}

                    <div class="col-sm-6 col-lg-4">

                        <div class="card border-0 shadow-sm rounded-4 h-100">

                            <div class="card-body">

                                <h2 class="h5 mb-3">
                                    {$item.card_id}
                                </h2>

                                <div class="d-flex gap-2">

                                    <a
                                        href="index.php?p=card&id={$item.card_id}"
                                        class="btn btn-dark"
                                    >
                                        View Card
                                    </a>

                                    <a
                                        href="index.php?p=remove-watchlist&id={$item.watchlist_id}"
                                        class="btn btn-outline-danger"
                                    >
                                        Remove
                                    </a>

                                </div>

                            </div>

                        </div>

                    </div>

                {/foreach}

            </div>

        {else}

            <div class="alert alert-light border">

                You have not added any cards to your watchlist yet.

            </div>

        {/if}

    </div>

</section>

{/block}