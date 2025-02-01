import {
    fetchUserInfo
} from "./motoko.js";
document.addEventListener("DOMContentLoaded", async function () {
    const data = await fetchUserInfo();
    if (data) {
        document.getElementById("username").innerHTML = data.name;
    };
});