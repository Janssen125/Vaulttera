import { showAllNFT, getUserInfo, getAllBoughtNFT, checkOwnership, transfer } from "./motoko.js";
import { Principal } from '@dfinity/principal';

document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get('id');
    const principal = Principal.fromText(JSON.parse(sessionStorage.getItem("principal")).__principal__);
    const currUser = await getUserInfo(principal);
    const result = await showAllNFT();
    for (let [i, [id, nft]] of result.entries()) {
        const user = await getUserInfo(nft.owner);
        const bought = await getAllBoughtNFT(id);
        
        const category = Object.keys(nft.category)[0] || "Unknown";
        if (id == nftId) {
            document.getElementById("image").src = nft.image;
            document.getElementById("name").innerHTML = nft.name;
            document.getElementById("owner").innerHTML = user.ok.name;
            document.getElementById("category").innerHTML = category;
            document.getElementById("price").innerHTML = nft.price;
            document.getElementById("description").innerHTML = nft.description;
            if (bought >= nft.slot) {
                document.getElementById('slot').innerHTML = `NFT is sold`;
            } else {
                document.getElementById("slot").innerHTML = nft.slot - bought;
            }
            const ownership = await checkOwnership(principal, id);
            if (ownership || user.ok.email == currUser.ok.email) {
                document.getElementById("benefit").innerHTML = nft.benefit;
            }

            return;
        }
    }
});

document.getElementById("buy").addEventListener("click", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get('id');
    await transferNft(nftId);
});

// New function to handle NFT transfer
async function transferNft(nftId) {
    const principal = Principal.fromText(JSON.parse(sessionStorage.getItem("principal")).__principal__);
    const result = await showAllNFT();
    const nft = result.find(([id, _]) => id === nftId)[1];
    const bought = await getAllBoughtNFT(nftId);

    if (bought < nft.slot) {
        const seller = nft.owner;
        const buyer = principal;
        const amount = nft.price;


        // Proceed with the transaction
        const transactionResult = await transfer(seller, buyer, amount);
        if (transactionResult.ok) {
            alert("NFT purchased successfully!");
        } else {
            alert("Failed to purchase NFT: " + transactionResult.err);
        }
    } else {
        alert("No slots available for this NFT.");
    }
}