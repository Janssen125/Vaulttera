import {
    buyNFT
} from "./motoko.js";

document.addEventListener("DOMContentLoaded", async function () {
        const buyButton = document.getElementById("buy");
});

buyButton.addEventListener("click", async function (){
    const id = window.location.search.split("=")[1];
    const result = await buyNFT(id);
    if(result){
        alert("Success");
        window.location.href = "index.html";
    }
    else{
        alert("Failed");
    }
});