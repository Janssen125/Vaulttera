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
      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      register(username, email, password);
    });

    document.getElementById("lpassword").addEventListener("focusout", function () {
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