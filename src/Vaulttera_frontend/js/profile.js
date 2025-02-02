import {
    fetchUserInfo,
    editProfile,
    editPass,
    getBalance,
    getAllBoughtNFT,
    getAllUserBought,
} from "./motoko.js";
import {
    Principal
} from '@dfinity/principal';
document.addEventListener("DOMContentLoaded", async function () {
    const data = await fetchUserInfo();
    const principal = Principal.fromText(JSON.parse(sessionStorage.getItem("principal")).__principal__);
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
        if (!username || !email || !bio) {
            alert("Input Must Have Value");
            return;
        };
        const result = await editProfile(principal, username, email, bio);
        if (result) {
            alert("Profile updated successfully");
            location.href = "index.html";
        } else {
            alert("Failed to update profile");
        };
    });

    document.getElementById("changePassBtn").addEventListener("click", async function () {
        const currPass = document.getElementById("curPass").value;
        const newPass = document.getElementById("newPass").value;
        const newPass2 = document.getElementById("newPass2").value;

        if (!currPass || !newPass || !newPass2) {
            alert("Input Must Have Value");
            return;
        };
        if (newPass != newPass2) {
            alert("Password does not match");
            return;
        };
        const principal = JSON.parse(sessionStorage.getItem("principal"));
        const result = await editPass(principal, currPass, newPass);
        if (result) {
            alert("Password updated successfully");
            location.href = "index.html";
        } else {
            alert("Current Password Incorrect");
        };
    });

    // NFT Bought Page

    const userBalance = await getBalance(principal);
    document.getElementById("balance").innerHTML = userBalance;
    const totalBought = await getAllUserBought(principal);
    

    document.getElementById("totalNft").innerHTML = totalBought.length;

    let items = ``;
    let expenses = 0;

    // Process all NFTs first
    for (let [i, [id, nft]] of totalBought.entries()) {
        expenses += Number(nft.price);
        const category = Object.keys(nft.category)[0] || "Unknown";
        items += `
                                                <div class="profile-nft-card">
                                        <img src="${nft.image}" alt="">
                                        <h4>Name: ${nft.name}</h4>
                                        <h6>Category: ${category}</h6>
                                        <a href="nftdetail.html?id=${id}" class="btn">Details</a>
                                    </div>`;
    }
    const element = document.getElementById("veryUniqueItems");
    if (element) {
        element.innerHTML = items; // Set the items once the loop finishes
    }

    document.getElementById("expense").innerHTML = expenses;
});