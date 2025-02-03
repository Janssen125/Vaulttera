import {
  register,
  login,
  checkGoogle
} from "./motoko.js";

document.addEventListener("DOMContentLoaded", function () {
  if (sessionStorage.getItem("principal")) {
    location.href = "./index.html";
  }
  document.getElementById("register").addEventListener("submit", function () {
    event.preventDefault();
    document.getElementById("registerBtn").innerHTML = "Loading...";
    document.getElementById("registerBtn").disabled = true;

      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      register(username, email, password);
    });

    document.getElementById("loginForm").addEventListener("submit", function () {
      event.preventDefault();
      document.getElementById("loginBtn").innerHTML = "Loading...";
      document.getElementById("loginBtn").disabled = true;
      const lemail = document.getElementById("lemail").value;
      const lpassword = document.getElementById("lpassword").value;
      if(lemail != null && lpassword != null) {
        login(lemail, lpassword);
      }
    });
    if(sessionStorage.getItem("google")) {
      checkGoogle();
    };
  });