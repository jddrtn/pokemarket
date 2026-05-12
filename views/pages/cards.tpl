{extends file="layout/main.tpl"}

{block name="body"}

<section class="py-4 bg-white border-top border-bottom">

    <div class="container">

        <div class="row g-3 align-items-end">

            <!-- Search cards -->
            <div class="col-12 col-lg-4">

                <label for="card-search-page" class="form-label fw-semibold">
                    Search cards
                </label>

                <div class="input-group">

                    <input
                        type="search"
                        id="card-search-page"
                        class="form-control"
                        placeholder="Example: Charizard"
                    >

                    <button
                        id="card-search-button"
                        class="btn btn-dark"
                        type="button"
                    >
                        Search
                    </button>

                </div>

            </div>

            <!-- Filter by set -->
            <div class="col-12 col-lg-4">

                <label for="card-set-filter" class="form-label fw-semibold">
                    Filter by set
                </label>

                <div class="input-group">

                    <input
                        type="search"
                        id="card-set-filter"
                        class="form-control"
                        placeholder="Example: Scarlet & Violet"
                    >

                    <button
                        id="card-set-filter-button"
                        class="btn btn-dark"
                        type="button"
                    >
                        Filter
                    </button>

                </div>

            </div>

            <!-- Sort -->
            <div class="col-12 col-lg-4">

                <label for="card-sort" class="form-label fw-semibold">
                    Sort cards
                </label>

                <select id="card-sort" class="form-select">

                    <option value="name">
                        Name A-Z
                    </option>

                    <option value="-name">
                        Name Z-A
                    </option>

                    <option value="-set.releaseDate">
                        Newest set first
                    </option>

                    <option value="set.releaseDate">
                        Oldest set first
                    </option>

                    <option value="number">
                        Card number
                    </option>

                </select>

            </div>

        </div>

    </div>

</section>

<section class="py-5" aria-labelledby="cards-heading">

    <div class="container">

        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">

            <div>

                <h2 id="cards-heading" class="h2 mb-1">
                    All Cards
                </h2>

                <p class="text-secondary mb-0" id="cards-count">
                    Loading cards...
                </p>

            </div>

            <!-- Currency toggle -->
            <div class="d-flex align-items-center flex-wrap gap-2">

                <span class="text-secondary small">
                    Currency:
                </span>

                <div class="btn-group" role="group" aria-label="Currency toggle">

                    <button
                        id="currency-gbp"
                        type="button"
                        class="btn btn-dark btn-sm"
                    >
                        £ GBP
                    </button>

                    <button
                        id="currency-usd"
                        type="button"
                        class="btn btn-outline-dark btn-sm"
                    >
                        $ USD
                    </button>

                </div>

            </div>

        </div>

        <!-- Loading -->
        <div id="cards-loading" class="text-center py-5">

            <div class="spinner-border" role="status" aria-hidden="true"></div>

            <p class="mt-3 text-secondary mb-0">
                Loading cards...
            </p>

        </div>

        <!-- Error -->
        <div
            id="cards-error"
            class="alert alert-danger d-none"
            role="alert"
        >
            Unable to load cards right now.
        </div>

        <!-- Cards grid -->
        <div id="cards-grid" class="row g-4"></div>

        <!-- Pagination -->
        <div class="d-flex justify-content-center gap-2 mt-5">

            <button
                id="prev-cards"
                class="btn btn-outline-dark"
                type="button"
            >
                Previous
            </button>

            <span
                id="cards-page-info"
                class="align-self-center text-secondary"
            >
                Page 1
            </span>

            <button
                id="next-cards"
                class="btn btn-dark"
                type="button"
            >
                Next
            </button>

        </div>

    </div>

</section>

{/block}