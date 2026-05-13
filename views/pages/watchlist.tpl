{extends file="layout/main.tpl"}

{block name="content"}

<section class="py-5">

    <div class="container">

        {if $watchlist}

            <div class="row g-4">

                {foreach $watchlist as $item}

                    <div class="col-md-6 col-lg-4">

                        <div class="card border-0 shadow-sm rounded-4 h-100">

                            <div class="card-body">

                                <h5 class="card-title fw-bold mb-2">
                                    {$item.card_name}
                                </h5>

                                <p class="text-secondary small mb-3">
                                    Set: {$item.set_name}
                                </p>

                                <div class="d-flex gap-2">

                                    <a
                                        href="index.php?p=card&id={$item.card_id}"
                                        class="btn btn-dark"
                                    >
                                        View Card
                                    </a>

                                    <a
                                        href="index.php?p=remove-watchlist&card_id={$item.card_id}"
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

            <div class="card border-0 shadow-sm rounded-4">

                <div class="card-body p-5 text-center">

                    <i class="fa-solid fa-star fs-1 mb-3"></i>

                    <h2 class="h3 fw-bold mb-2">
                        Your watchlist is empty
                    </h2>

                    <p class="text-secondary mb-4">
                        Start saving Pokémon cards to build your watchlist.
                    </p>

                    <a href="index.php?p=cards" class="btn btn-dark">
                        Browse Cards
                    </a>

                </div>

            </div>

        {/if}

    </div>

</section>

{/block}