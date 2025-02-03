import {
    showAllNFT,
    getUserInfo,
    getAllBoughtNFT
} from "./motoko.js";
document.addEventListener("DOMContentLoaded", async function () {
    const result = await showAllNFT();
    
    let items = ``;

    for (let [i, [id, nft]] of result.entries()) {
        const user = await userInfo(nft.owner); 
        const bought = await getAllBoughtNFT(id);
        
        const total = bought;
        const category = Object.keys(nft.category)[0] || "Unknown";
        if(i == 0){
            items += `
            <div class="scroll-list__item js-scroll-list-item item-focus">
                <img src="${nft.image}" alt="" id="picture${i}">
                <div class="details">
                    <h1 id="name${i}"> ${nft.name}</h1>
                    <p> 
                        <i class="fa-solid fa-user"></i><span id="creator${i}"> ${user.name}</span> 
                        <br>
                        <i class="fa-solid fa-tag"></i><span id="category${i}"> ${category}</span>
                        <br>
                        <i class="fa-solid fa-money-bill"></i>IDR<span id="price${i}"> ${nft.price}</span>
                    </p>
                </div>
                <a href="nftdetail.html?id=${id}" class="btn">
                    <i class="fa-solid fa-people-group"></i><span id="total${i}"> ${total}/${nft.slot}</span>
                </a>
            </div>`;
        }
        else{
            items += `
            <div class="scroll-list__item js-scroll-list-item item-next">
                <img src="${nft.image}" alt="" id="picture${i}">
                <div class="details">
                    <h1 id="name${i}"> ${nft.name}</h1>
                    <p> 
                        <i class="fa-solid fa-user"></i><span id="creator${i}"> ${user.name}</span> 
                        <br>
                        <i class="fa-solid fa-tag"></i><span id="category${i}"> ${category}</span>
                        <br>
                        <i class="fa-solid fa-money-bill"></i> IDR<span id="price${i}"> ${nft.price}</span>
                    </p>
                </div>
                <a href="nftdetail.html?id=${id}" class="btn">
                    <i class="fa-solid fa-people-group"></i><span id="total${i}"> ${total}/${nft.slot}</span>
                </a>
            </div>`;
        }

    }

    // Now update the innerHTML once all items are ready
    const element = document.getElementById("veryUniqueItems");
    if (element) {
        element.innerHTML = items; // Set the items once the loop finishes
    }

    // If you still want to replace child nodes (you can avoid this if not necessary)
    if (element) {
        element.replaceWith(...element.childNodes);
    }
    console.log("nftbundle.js loaded");
    
});


async function userInfo(u) {
    const name = await getUserInfo(u);
    return name.ok;
}