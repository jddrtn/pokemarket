<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>PokéMarket</title>

    <meta name="description" content="Track Pokémon card prices, browse sets, and build your watchlist with PokéMarket.">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Shared JS -->
    <script src="js/cache.js"></script>

    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/styles.css">
</head>

<body>

    <!-- Site Header -->
    <header class="border-bottom">

        <div class="container">

            <nav class="navbar navbar-expand-lg py-3" aria-label="Main navigation">

                <!-- Logo -->
                <a class="navbar-brand fw-bold fs-3 me-lg-4" href="index.php">
                    PokéMarket
                </a>

                <!-- Mobile menu button -->
                <button
                    class="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNav"
                    aria-controls="mainNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span class="navbar-toggler-icon"></span>
                </button>

                <!-- Navbar content -->
                <div class="collapse navbar-collapse" id="mainNav">

                    <!-- Search form -->
                    <form
                        class="nav-search-form my-3 my-lg-0 me-lg-4 flex-grow-1"
                        role="search"
                        aria-label="Search Pokémon cards"
                    >

                        <label for="card-search" class="visually-hidden">
                            Search Pokémon cards
                        </label>

                        <div class="input-group">

                            <input
                                type="search"
                                id="card-search"
                                class="form-control"
                                placeholder="Search Pokémon cards..."
                            >

                            <button class="btn btn-dark" type="submit">
                                Search
                            </button>

                        </div>

                    </form>

                    <!-- Navigation links -->
                    <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">

                        <li class="nav-item">
                            <a class="nav-link" href="index.php">
                                <i class="fa-solid fa-house me-1"></i>
                                Home
                            </a>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link" href="index.php?p=sets">
                                <i class="fa-solid fa-layer-group me-1"></i>
                                Sets
                            </a>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link" href="index.php?p=cards">
                                <i class="fa-solid fa-clone me-1"></i>
                                Cards
                            </a>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link" href="index.php?p=watchlist">
                                <i class="fa-solid fa-star me-1"></i>
                                Watchlist
                            </a>
                        </li>

                        <!-- Login / Logout -->
                        <li class="nav-item">

                            {if isset($smarty.session.is_loggedin)}

                              

                              <a class="btn btn-dark ms-lg-2" href="index.php?p=account">
                              <i class="fa-solid fa-user me-1"></i>
                               My Account
                            </a>

                            {else}

                             <a class="btn btn-dark ms-lg-2" href="index.php?p=login">
                             <i class="fa-solid fa-user me-1"></i>
                            Sign In
                            </a>

                            {/if}

                        </li>

                    </ul>

                </div>

            </nav>

        </div>

    </header>

    <!-- Main page content -->
    <main id="main-content">

        {block name="body"}{/block}

    </main>

    <!-- Footer -->
    <footer class="py-5 border-top">

        <div class="container">

            <div class="row g-4">

                <div class="col-md-6">

                    <h3 class="fw-bold mb-2">
                        PokéMarket
                    </h3>

                    <p class="mb-0">
                        Track Pokémon card prices, explore sets, and stay up to date with the market.
                    </p>

                </div>

                <div class="col-6 col-md-3">

                    <h3 class="fw-semibold mb-3">
                        Browse
                    </h3>

                    <ul class="list-unstyled mb-0">

                        <li>
                            <a href="index.php?p=cards" class="text-decoration-none">
                                Cards
                            </a>
                        </li>

                        <li>
                            <a href="index.php?p=sets" class="text-decoration-none">
                                Sets
                            </a>
                        </li>

                    </ul>

                </div>

                <div class="col-6 col-md-3">

                    <h3 class="fw-semibold mb-3">
                        Account
                    </h3>

                    <ul class="list-unstyled mb-0">

                        <li>
                            <a href="index.php?p=login" class="text-decoration-none">
                                Sign In
                            </a>
                        </li>

                        <li>
                            <a href="index.php?p=login" class="text-decoration-none">
                                Register
                            </a>
                        </li>

                        <li>
                            <a href="index.php?p=watchlist" class="text-decoration-none">
                                Watchlist
                            </a>
                        </li>

                    </ul>

                </div>

            </div>

            <div class="text-center mt-4 pt-3">

                <p class="mb-0">
                    &copy; 2026 PokéMarket
                </p>

            </div>

        </div>

    </footer>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>


</body>
</html>