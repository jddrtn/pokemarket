{extends file="layout/main.tpl"}

{block name="body"}

<!-- Hero section -->
<section class="hero-section py-5 py-lg-6 text-center">

    <div class="container">

        <h1 class="display-5 fw-bold mb-3">
            Track Pokémon card prices and discover new cards
        </h1>

        <p class="lead mb-4 mx-auto hero-text">
            Browse cards and stay up to date with market prices in one place.
        </p>

        <!-- CTA buttons -->
        <div class="d-flex justify-content-center flex-wrap gap-2">

            <a href="index.php?p=cards" class="btn btn-dark btn-lg">
                Browse Cards
            </a>

            <a href="index.php?p=sets" class="btn btn-dark btn-lg">
                View Sets
            </a>

        </div>

    </div>

</section>

<!-- Featured cards section -->
<section class="py-5" aria-labelledby="featured-cards-heading">

    <div class="container">

        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">

            <div>

                <h2 id="featured-cards-heading" class="h2 mb-1">
                    Featured Cards
                </h2>

                <p class="mb-0">
                    Popular cards selected by PokéMarket
                </p>

            </div>

            <div class="d-flex align-items-center flex-wrap gap-2">

                <span class="small">
                    Currency:
                </span>

                <div class="btn-group" role="group" aria-label="Currency toggle">

                    <button id="currency-gbp" type="button" class="btn btn-dark btn-sm">
                        £ GBP
                    </button>

                    <button id="currency-usd" type="button" class="btn btn-outline-dark btn-sm">
                        $ USD
                    </button>

                </div>

                <a href="index.php?p=cards" class="fw-semibold link-dark ms-md-2">
                    View all cards
                </a>

            </div>

        </div>

        <!-- Loading state -->
        <div id="trending-loading" class="text-center py-5">

            <div class="spinner-border" role="status" aria-hidden="true"></div>

            <p class="mt-3 mb-0">
                Loading featured cards...
            </p>

        </div>

        <!-- Error state -->
        <div id="trending-error" class="alert alert-danger d-none" role="alert">
            Unable to load featured cards right now.
        </div>

        <!-- Custom carousel -->
        <div id="trendingCardsCarousel" class="d-none">

            <div class="featured-carousel-wrapper">

                <button
                    id="featured-prev"
                    class="featured-carousel-btn"
                    type="button"
                    aria-label="Previous card"
                >
                    &larr;
                </button>

                <div
                    id="trending-cards-carousel-inner"
                    class="featured-carousel-track"
                >
                    <!-- JS inserts cards here -->
                </div>

                <button
                    id="featured-next"
                    class="featured-carousel-btn"
                    type="button"
                    aria-label="Next card"
                >
                    &rarr;
                </button>

            </div>

        </div>

    </div>

</section>

<!-- Recent sets section -->
<section
    class="py-5 bg-white border-top border-bottom"
    aria-labelledby="recent-sets-heading"
>

    <div class="container">

        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">

            <div>

                <h2 id="recent-sets-heading" class="h2 mb-1">
                    Recent Sets
                </h2>

                <p class="mb-0">
                    Browse newer Pokémon TCG releases
                </p>

            </div>

            <a href="index.php?p=sets" class="fw-semibold link-dark">
                View all sets
            </a>

        </div>

        <div id="recent-sets-loading" class="text-center py-4">

            <div class="spinner-border" role="status" aria-hidden="true"></div>

            <p class="mt-3 mb-0">
                Loading recent sets...
            </p>

        </div>

        <div
            id="recent-sets-error"
            class="alert alert-danger d-none"
            role="alert"
        >
            Unable to load recent sets right now.
        </div>

        <div id="recent-sets-grid" class="row g-4"></div>

    </div>

</section>

<!-- Vintage sets section -->
<section class="py-5" aria-labelledby="vintage-sets-heading">

    <div class="container">

        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">

            <div>

                <h2 id="vintage-sets-heading" class="h2 mb-1">
                    Vintage Sets
                </h2>

                <p class="mb-0">
                    Explore early Pokémon TCG sets
                </p>

            </div>

            <a href="index.php?p=sets" class="fw-semibold link-dark">
                View all sets
            </a>

        </div>

        <div id="vintage-sets-loading" class="text-center py-4">

            <div class="spinner-border" role="status" aria-hidden="true"></div>

            <p class="mt-3 mb-0">
                Loading vintage sets...
            </p>

        </div>

        <div
            id="vintage-sets-error"
            class="alert alert-danger d-none"
            role="alert"
        >
            Unable to load vintage sets right now.
        </div>

        <div id="vintage-sets-grid" class="row g-4"></div>

    </div>

</section>

<script src="js/index.js"></script>

{/block}