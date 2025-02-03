import {
    showAllNFT,
    getUserInfo,
    getAllBoughtNFT,
    checkOwnership,
    transfer,
    buyNFT
} from "./motoko.js";
import {
    Principal
} from '@dfinity/principal';

document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get('id');
    let principal;
    try {
        principal = Principal.fromText(JSON.parse(sessionStorage.getItem("principal")).__principal__);
    } catch (error) {
        location.href = "./login.html";
    }
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

        const buyResult = await buyNFT(generateRandomID(10), buyer, nftId);
        console.log(buyResult);
        
        if ("ok" in buyResult) {
            const transactionResult = await transfer(buyer, seller, amount);
            if ("ok" in transactionResult) {
                alert("NFT purchased successfully!");
                window.location.reload();
            } else {
                alert("Failed to purchase NFT: " + transactionResult.err);
            }
        } else {
            alert("Failed to purchase NFT#2: " + buyResult.err);
        }
    } else {
        alert("No slots available for this NFT.");
    }
}

function generateRandomID(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}