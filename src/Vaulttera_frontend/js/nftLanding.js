import {
    showAllNFT,
} from "./motoko.js";
document.addEventListener("DOMContentLoaded", async function () {
    const result = await showAllNFT(); // Now returns [(id, nft)]
    console.log("Debug result:", result);

//     let items = ``;

//     // Process all NFTs first
document.getElementById("ptop1").src = result[0][1].image;
document.getElementById("ptop11").src = result[0][1].image;
document.getElementById("ptop2").src = result[1][1].image;
document.getElementById("ptop22").src = result[1][1].image;
document.getElementById("ptop3").src = result[2][1].image;
document.getElementById("ptop33").src = result[2][1].image;
document.getElementById("ptop4").src = result[3][1].image;
document.getElementById("ptop44").src = result[3][1].image;

document.getElementById("desc1").innerHTML = result[0][1].description;
document.getElementById("desc2").innerHTML = result[1][1].description;
document.getElementById("desc3").innerHTML = result[2][1].description;
document.getElementById("desc4").innerHTML = result[3][1].description;
document.getElementById("ptop5").src = result[4][1].image;
document.getElementById("ptop55").src = result[4][1].image;
document.getElementById("desc5").innerHTML = result[4][1].description;

    // for (let [i, [id, nft]] of result.entries()) {
        //         if (i == 0) {
//             items += `<div class="swiper-slide">
// <div class="card">
//     <div class="front">
//         <img src="${nft.image}" alt="">
//         <button>View Details</button>
//     </div>
//     <div class="back">
//         <img src="${nft.image}" alt="">
//         <p>${nft.description}</p>
//     </div>
// </div>
// </div>`;
//         } else if (i == 1){
//             items += `
// <div class="swiper-slide">
// <div class="card">
//     <div class="front">
//         <img src="${nft.image}" alt="">
//         <button>View Details</button>
//     </div>
//     <div class="back">
//         <img src="${nft.image}" alt="">
//         <p>${nft.description}</p>
//     </div>
// </div>
// </div>`;
//         }
//         else if(i == 2){
//             items += `
//             <div class="swiper-slide">
//             <div class="card">
//                 <div class="front">
//                     <img src="${nft.image}" alt="">
//                     <button>View Details</button>
//                 </div>
//                 <div class="back">
//                     <img src="${nft.image}" alt="">
//                     <p>${nft.description}</p>
//                 </div>
//             </div>
//             </div>`;
//         }
//         else{
//             items += `
//             <div class="swiper-slide">
//             <div class="card">
//                 <div class="front">
//                     <img src="${nft.image}" alt="">
//                     <button>View Details</button>
//                 </div>
//                 <div class="back">
//                     <img src="${nft.image}" alt="">
//                     <p>${nft.description}</p>
//                 </div>
//             </div>
//             </div>`;
//         }

    // }

    // Now update the innerHTML once all items are ready
    // const element = document.getElementById("veryUniqueItems");
    // if (element) {
    //     element.innerHTML = items; // Set the items once the loop finishes
    // }

    // If you still want to replace child nodes (you can avoid this if not necessary)
    // if (element) {
    //     element.replaceWith(...element.childNodes);
    // }
    console.log("nftbundle.js loaded");

});