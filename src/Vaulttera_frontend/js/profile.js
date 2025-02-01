import {
    fetchUserInfo
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
        const noJsonPic = JSON.parse(pic);
        document.getElementById("profilePic").src = noJsonPic.picture;
    };

    document.getElementById("logout").addEventListener("click", function () {
        sessionStorage.clear();
        location.href = "index.html";
    });
});