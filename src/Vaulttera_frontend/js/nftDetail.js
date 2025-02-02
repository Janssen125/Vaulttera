import { showAllNFT, getUserInfo, getAllBoughtNFT, checkOwnership } from "./motoko.js";
import {
    Principal
} from '@dfinity/principal';
document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get('id');
    const principal = Principal.fromText(JSON.parse(sessionStorage.getItem("principal")).__principal__);
    const currUser = await getUserInfo(principal);
    const result = await showAllNFT(nftId);
    for (let [i,[id, nft]] of result.entries()) {
        const user = await getUserInfo(nft.owner);
        const bought = await getAllBoughtNFT(id);
        
        const category = Object.keys(nft.category)[0] || "Unknown";
        if(id == nftId) {
            document.getElementById("image").src = nft.image;
            document.getElementById("name").innerHTML = nft.name;
            document.getElementById("owner").innerHTML = user.ok.name;
            document.getElementById("category").innerHTML = category;
            document.getElementById("price").innerHTML = nft.price;
            document.getElementById("description").innerHTML = nft.description;
            if(bought >= nft.slot) {
                document.getElementById('slot').innerHTML = `NFT is sold`;
            }
            else{
                document.getElementById("slot").innerHTML = nft.slot - bought;
            }
            const ownership = await checkOwnership(principal, id);
            if (ownership || user.ok.email == currUser.ok.email) {
                document.getElementById("benefit").innerHTML = nft.benefit;
            }

            return;
        }
    };
});