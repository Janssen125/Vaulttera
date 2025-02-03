import {
    getUserInfo,
    getAllBoughtNFT,
    showAllNFT,
    getRevenue,
    deleteNFT,
} from "./motoko.js";
import {
    Principal
} from '@dfinity/principal';

async function confirmDelete(event, element) {
    event.preventDefault();

    let id = element.getAttribute("data-id");
    let confirmation = confirm(`Are you sure you want to delete item with ID: ${id}?`);

    if (confirmation) {
        const delRes = await deleteNFT(id);
        if ("ok" in delRes) {
            alert("NFT Deleted");
            location.reload();
        } else if ("err" in delRes) {
            alert("Fail to delete NFT");
        } else {
            alert("NFT not avaliable");
        }
    } else {
        alert("Deletion canceled.");
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    let principal;
    try {
        principal = Principal.fromText(JSON.parse(sessionStorage.getItem("principal")).__principal__);
    } catch (error) {
        console.log("Error Fetching User");
        location.href = "login.html";
    }
    const user = await getUserInfo(principal);
    if ("err" in user) {
        console.log(user.err);

    } else if ("ok" in user) {

        const result = await showAllNFT();
        const revenue = await getRevenue(principal);
        let items = `<div class="create-nft-button">
        <a href="./createnft.html" class="btn">CREATE NFT</a>
                    Total Revenue: ${revenue}
                </div>`;
        let norev = true;

        for (let [i, [id, nft]] of result.entries()) {
            const userOwner = await getUserInfo(nft.owner);
            const bought = await getAllBoughtNFT(id);

            const category = Object.keys(nft.category)[0] || "Unknown";

            if (user.ok.email == userOwner.ok.email) {
                norev = false;
                items += `                <div class="col-md-3">
                <div class="card-revenue">
                <div class="imgBx-revenue">
                <img src="${nft.image}" alt="">
                </div>
                <div class="content-revenue">
                <h4>${nft.name}</h4>
                <p>${category}
                <br>
                IDR ${nft.price}
                <br>
                Slot<small> ${bought}/${nft.slot}</small>
                </p>
                <a href="nftdetail.html?id=${id}" class="btn btn-primary"><i class="fa-solid fa-eye"></i></a>
                <a href="editnft.html?id=${id}" class="btn btn-warning"><i class="fa-solid fa-pencil"></i></a>
                <a href="#" class="btn btn-danger delete-btn" data-id="${id}"><i class="fa-solid fa-trash"></i></a>
                </div>
                </div>
                </div>`;
            }
        };
        if (!norev) {
            const element = document.getElementById("veryUniqueItems");
            if (element) {
                element.innerHTML = items;

                document.querySelectorAll(".delete-btn").forEach(btn => {
                    btn.addEventListener("click", function (event) {
                        confirmDelete(event, this);
                    });
                });
            }
        }

    } else {
        console.log("Error Fetching User");
    }


});