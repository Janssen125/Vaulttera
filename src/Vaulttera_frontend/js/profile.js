import {
    fetchUserInfo,
    editProfile
} from "./motoko.js";
document.addEventListener("DOMContentLoaded", async function () {
    const data = await fetchUserInfo();
    if (data) {
        document.getElementById("usernameIn").value = data.name;
        document.getElementById("email").value = data.email;
        document.getElementById("bio").value = data.bioStatus;
    };
    const pic = sessionStorage.getItem("google");
    if (pic) {
        document.getElementById("profilePic").src = pic;
    };

    document.getElementById("logout").addEventListener("click", function () {
        sessionStorage.clear();
        location.href = "index.html";
    });

    document.getElementById("changeProfile").addEventListener("click", async function () {
        const username = document.getElementById("usernameIn").value;
        const email = document.getElementById("email").value;
        const bio = document.getElementById("bio").value;
        const principal = JSON.parse(sessionStorage.getItem("principal"));
        const result = await editProfile(principal, username, email, bio);
        if (result) {
            alert("Profile updated successfully");
            location.href = "index.html";
        } else {
            alert("Failed to update profile");
        }
    });
});