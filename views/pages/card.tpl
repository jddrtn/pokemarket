{extends file="layout/main.tpl"}

{block name="body"}

<section class="py-5">

    <div class="container">

        <!-- Loading state -->
        <div id="card-loading" class="text-center py-5">

            <div class="spinner-border" role="status" aria-hidden="true"></div>

            <p class="mt-3 text-secondary mb-0">
                Loading card...
            </p>

        </div>

        <!-- Error state -->
        <div
            id="card-error"
            class="alert alert-danger d-none"
            role="alert"
        >
            Could not load this card.
        </div>

<!-- Card details injected by JS -->
<div id="card-detail" class="d-none"></div>

<!-- Watchlist button -->
<div class="text-center mt-4">

    {if isset($smarty.session.is_loggedin)}

        <a
            href="index.php?p=add-watchlist&card_id={$smarty.get.id}"
            class="btn btn-dark btn-lg"
        >
            <i class="fa-solid fa-star me-2"></i>
            Add to Watchlist
        </a>

    {else}

        <a
            href="index.php?p=login"
            class="btn btn-dark btn-lg"
        >
            <i class="fa-solid fa-user me-2"></i>
            Sign in to save cards
        </a>

    {/if}

</div>

    </div>

</section>

{/block}