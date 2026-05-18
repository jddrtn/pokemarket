{extends file="layout/main.tpl"}

{block name="body"}

<section class="py-5">

    <div class="container">

        <div class="row justify-content-center">

            <div class="col-lg-6">

                <div class="card border-0 shadow-sm rounded-4">

                    <div class="card-body p-4 p-md-5">

                        <h1 class="h2 fw-bold mb-3">
                            Change Password
                        </h1>

                        <p class="text-secondary mb-4">
                            Update your account password.
                        </p>

                        {if $error}
                            <div class="alert alert-danger">
                                {$error}
                            </div>
                        {/if}

                        {if $success}
                            <div class="alert alert-success">
                                {$success}
                            </div>
                        {/if}

                        <form method="post">

                            <!-- Current password -->
                            <div class="mb-3">

                                <label for="current-password" class="form-label fw-semibold">
                                    Current Password
                                </label>

                                <input
                                    type="password"
                                    id="current-password"
                                    name="current_password"
                                    class="form-control"
                                    required
                                >

                            </div>

                            <!-- New password -->
                            <div class="mb-3">

                                <label for="new-password" class="form-label fw-semibold">
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    id="new-password"
                                    name="new_password"
                                    class="form-control"
                                    required
                                >

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

                                <label for="confirm-password" class="form-label fw-semibold">
                                    Confirm New Password
                                </label>

                                <input
                                    type="password"
                                    id="confirm-password"
                                    name="confirm_password"
                                    class="form-control"
                                    required
                                >

                            </div>

                            <button
                                type="submit"
                                name="change_password"
                                class="btn btn-dark w-100"
                            >
                                Change Password
                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </div>

    </div>

</section>

{/block}