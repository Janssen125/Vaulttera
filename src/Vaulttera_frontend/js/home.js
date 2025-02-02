document.addEventListener("DOMContentLoaded", function () {
    const storedPrincipal = sessionStorage.getItem("principal");

    if (storedPrincipal) {
        const loggedInButton = '<a class="nav-link nav-authenticated" href="profile.html" id="username">Loading...</a>';
        document.getElementById("login").innerHTML = loggedInButton;
    }
    else {
        const loginButton = '<a class="nav-link nav-login" href="login.html">Login</a>';
        document.getElementById("login").innerHTML = loginButton;
    }

});
