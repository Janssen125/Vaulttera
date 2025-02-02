import { showAllNFT, getUserInfo, getAllBoughtNFT } from "./motoko.js";
document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get('id'); // Get the 'id' parameter from the URL
    console.log(nftId); // Output: NFT3
    const result = await showAllNFT(nftId);
    console.log(result);
    for (let [i,[id, nft]] of result.entries()) {
        console.log(id);
        const user = await getUserInfo(nft.owner);
        const bought = await getAllBoughtNFT(id);
        console.log(user);
        
        const category = Object.keys(nft.category)[0] || "Unknown";
        if(id == nftId) {
            console.log(nft);
            document.getElementById("image").src = nft.image;
            document.getElementById("name").innerHTML = nft.name;
            document.getElementById("owner").innerHTML = user.ok.name;
            document.getElementById("category").innerHTML = category;
            document.getElementById("price").innerHTML = nft.price;
            document.getElementById("description").innerHTML = nft.description;
            if(bought >= nft.slot) {
                console.log('NFT is sold');
                document.getElementById('slot').innerHTML = `NFT is sold`;
            }
            else{
                document.getElementById("slot").innerHTML = nft.slot - bought;
            }
            return;
        }
    };
});