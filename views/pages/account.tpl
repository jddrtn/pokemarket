{extends file="layout/main.tpl"}

{block name="body"}

<section class="py-5">

    <div class="container">

        <!-- Account heading -->
        <div class="mb-5">

            <h1 class="display-5 fw-bold mb-2">
                My Account
            </h1>

            <p class="lead text-secondary mb-0">
                Welcome back, {$user_data.user_email}
            </p>

        </div>

        <!-- Account action cards -->
        <div class="row g-4">

            <!-- Watchlist card -->
            <div class="col-md-6">

                <div class="card border-0 shadow-sm rounded-4 h-100">

                    <div class="card-body p-4">

                        <div class="d-flex align-items-center mb-3">

                            <i class="fa-solid fa-star fs-3 me-3"></i>

                            <div>

                                <h2 class="h4 fw-bold mb-1">
                                    Watchlist
                                </h2>

                                <p class="text-secondary mb-0">
                                    View your saved cards
                                </p>

                            </div>

                        </div>

                        <a
                            href="index.php?p=watchlist"
                            class="btn btn-dark"
                        >
                            View Watchlist
                        </a>

                    </div>

                </div>

            </div>

            <!-- Change password card -->
            <div class="col-md-6">

                <div class="card border-0 shadow-sm rounded-4 h-100">

                    <div class="card-body p-4">

                        <div class="d-flex align-items-center mb-3">

                            <i class="fa-solid fa-key fs-3 me-3"></i>

                            <div>

                                <h2 class="h4 fw-bold mb-1">
                                    Change Password
                                </h2>

                                <p class="text-secondary mb-0">
                                    Update your account password
                                </p>

                            </div>

                        </div>

                        <a
                            href="index.php?p=change-password"
                            class="btn btn-dark"
                        >
                            Change Password
                        </a>

                    </div>

                </div>

            </div>

            <!-- Logout card -->
            <div class="col-md-6">

                <div class="card border-0 shadow-sm rounded-4 h-100">

                    <div class="card-body p-4">

                        <div class="d-flex align-items-center mb-3">

                            <i class="fa-solid fa-right-from-bracket fs-3 me-3"></i>

                            <div>

                                <h2 class="h4 fw-bold mb-1">
                                    Logout
                                </h2>

                                <p class="text-secondary mb-0">
                                    Sign out of your account
                                </p>

                            </div>

                        </div>

                        <a
                            href="logout.php"
                            class="btn btn-dark"
                        >
                            Logout
                        </a>

                    </div>

                </div>

            </div>

        </div>

    </div>

</section>

{/block}