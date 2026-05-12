{extends file="layout/main.tpl"}

{block name="body"}

<section class="py-4 bg-white border-top border-bottom">

    <div class="container">

        <div class="row g-3 align-items-end">

            <!-- Search sets -->
            <div class="col-12 col-lg-6">

                <label for="set-search" class="form-label fw-semibold">
                    Search sets
                </label>

                <div class="input-group">

                    <input
                        type="search"
                        id="set-search"
                        class="form-control"
                        placeholder="Example: Scarlet & Violet"
                    >

                    <button
                        id="set-search-button"
                        class="btn btn-dark"
                        type="button"
                    >
                        Search
                    </button>

                </div>

            </div>

            <!-- Sort sets -->
            <div class="col-12 col-lg-6">

                <label for="set-sort" class="form-label fw-semibold">
                    Sort sets
                </label>

                <select id="set-sort" class="form-select">

                    <option value="-releaseDate">
                        Newest first
                    </option>

                    <option value="releaseDate">
                        Oldest first
                    </option>

                    <option value="name">
                        Name A-Z
                    </option>

                    <option value="-name">
                        Name Z-A
                    </option>

                </select>

            </div>

        </div>

    </div>

</section>

<section class="py-5" aria-labelledby="sets-heading">

    <div class="container">

        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">

            <div>

                <h2 id="sets-heading" class="h2 mb-1">
                    All Sets
                </h2>

                <p class="text-secondary mb-0" id="sets-count">
                    Loading sets...
                </p>

            </div>

        </div>

        <!-- Loading -->
        <div id="sets-loading" class="text-center py-5">

            <div class="spinner-border" role="status" aria-hidden="true"></div>

            <p class="mt-3 text-secondary mb-0">
                Loading sets...
            </p>

        </div>

        <!-- Error -->
        <div
            id="sets-error"
            class="alert alert-danger d-none"
            role="alert"
        >
            Unable to load sets right now.
        </div>

        <!-- Sets grid -->
        <div id="sets-grid" class="row g-4"></div>

        <!-- Pagination -->
        <div class="d-flex justify-content-center gap-2 mt-5">

            <button
                id="prev-sets"
                class="btn btn-outline-dark"
                type="button"
            >
                Previous
            </button>

            <span
                id="sets-page-info"
                class="align-self-center text-secondary"
            >
                Page 1
            </span>

            <button
                id="next-sets"
                class="btn btn-dark"
                type="button"
            >
                Next
            </button>

        </div>

    </div>

</section>

{/block}