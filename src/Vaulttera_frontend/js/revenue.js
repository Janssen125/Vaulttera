import {
    getUserInfo,
    getAllBoughtNFT,
    showAllNFT,
} from "./motoko.js";
import {
    Principal
} from '@dfinity/principal';
document.addEventListener("DOMContentLoaded", async function () {
    const principal = Principal.fromText(JSON.parse(sessionStorage.getItem("principal")).__principal__);
    const user = await getUserInfo(principal);
    if ("err" in user) {
        console.log(user.err);

    } else if ("ok" in user) {

        const result = await showAllNFT();

        let items = `<div class="create-nft-button">
                    <a href="./createnft.html" class="btn">CREATE NFT</a>
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
                <a href="" class="btn btn-primary"><i class="fa-solid fa-eye"></i></a>
                <a href="" class="btn btn-warning"><i class="fa-solid fa-pencil"></i></a>
                <a href="" class="btn btn-danger"><i class="fa-solid fa-trash"></i></a>
                </div>
                </div>
                </div>`;
            }
        };
        if (!norev) {
        const element = document.getElementById("veryUniqueItems");
        if (element) {
            element.innerHTML = items; // Set the items once the loop finishes
        }
        }

    } else {
        console.log("Error Fetching User");
    }
});