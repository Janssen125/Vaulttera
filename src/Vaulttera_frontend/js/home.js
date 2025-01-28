document.addEventListener("DOMContentLoaded", function () {
    // sessionStorage.setItem("principal", "6vna6-am6d2-fjuqg-7nfj7-6222p-wkmwn-yglwh-or6bj-tfkmo-bh2yk-yqe");
    const storedPrincipal = sessionStorage.getItem("principal");

    if (storedPrincipal) {
        const loggedInButton = '<a class="nav-link" href="profile.html" id="username">Loading...</a>';
        document.getElementById("login").innerHTML = loggedInButton;
    }
    else {
        const loginButton = '<a class="nav-link" href="login.html">Login</a>';
        document.getElementById("login").innerHTML = loginButton;
    }
});