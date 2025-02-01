document.addEventListener("DOMContentLoaded", function () {
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
