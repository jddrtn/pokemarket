{extends file="layout/main.tpl"}

{block name="body"}

<section class="py-5">

    <div class="container">

        <div class="text-center mb-5">

            <h1 class="display-6 fw-bold mb-2">
                Sign in to PokéMarket
            </h1>

            <p class="text-secondary mb-0">
                Log in to your account or create a new one to start building your watchlist.
            </p>

        </div>

        <div class="row g-4 justify-content-center">

            <!-- Login column -->
            <div class="col-12 col-lg-6">

                <div class="card border-0 shadow-sm rounded-4 h-100">

                    <div class="card-body p-4 p-md-5">

                        <h2 class="h3 fw-bold mb-3">
                            Log In
                        </h2>

                        <p class="text-secondary mb-4">
                            Access your saved cards and watchlist.
                        </p>

                        <form id="login-form" method="post">

                            {if $login_error}
                                <div class="alert alert-danger">
                                    {$login_error}
                                </div>
                            {/if}

                            <div class="mb-3">

                                <label for="login-email" class="form-label fw-semibold">
                                    Email address
                                </label>

                                <input
                                    type="email"
                                    id="login-email"
                                    name="login_email"
                                    class="form-control"
                                    placeholder="you@example.com"
                                    required
                                >

                            </div>

                            <div class="mb-4">

                                <label for="login-password" class="form-label fw-semibold">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    id="login-password"
                                    name="login_password"
                                    class="form-control"
                                    placeholder="Enter your password"
                                    required
                                >

                            </div>

                            <button type="submit" name="login" class="btn btn-dark w-100">
                                Log In
                            </button>

                        </form>

                    </div>

                </div>

            </div>

            <!-- Register column -->
            <div class="col-12 col-lg-6">

                <div class="card border-0 shadow-sm rounded-4 h-100">

                    <div class="card-body p-4 p-md-5">

                        <h2 class="h3 fw-bold mb-3">
                            Register
                        </h2>

                        <p class="text-secondary mb-4">
                            Create an account to save Pokémon cards to your watchlist.
                        </p>

                        <form id="register-form" method="post">

                            {if $register_error}
                                <div class="alert alert-danger">
                                    {$register_error}
                                </div>
                            {/if}

                            {if $success}
                                <div class="alert alert-success">
                                    {$success}
                                </div>
                            {/if}

                            <!-- Email -->
                            <div class="mb-3">

                                <label for="register-email" class="form-label fw-semibold">
                                    Email address
                                </label>

                                <input
                                    type="email"
                                    id="register-email"
                                    name="register_email"
                                    class="form-control"
                                    placeholder="you@example.com"
                                    required
                                >

                            </div>

                            <!-- Password -->
                            <div class="mb-3">

                                <label for="register-password" class="form-label fw-semibold">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    id="register-password"
                                    name="register_password"
                                    class="form-control"
                                    placeholder="Create a password"
                                    required
                                >

                                <!-- Password requirements -->
                                <div class="form-text mt-2">

                                    Password must:

                                    <ul class="mb-0 ps-3">

                                        <li>Be at least 8 characters</li>
                                        <li>Include an uppercase letter</li>
                                        <li>Include a number</li>
                                        <li>Include a special character</li>

                                    </ul>

                                </div>

                            </div>

                            <!-- Confirm password -->
                            <div class="mb-4">

                                <label for="register-password-confirm" class="form-label fw-semibold">
                                    Confirm password
                                </label>

                                <input
                                    type="password"
                                    id="register-password-confirm"
                                    name="register_password_confirm"
                                    class="form-control"
                                    placeholder="Confirm your password"
                                    required
                                >

                            </div>

                            <!-- Register button -->
                            <button type="submit" name="register" class="btn btn-dark w-100">
                                Register
                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </div>

    </div>

</section>

{/block}