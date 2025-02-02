import {
    showAllNFT,
} from "./motoko.js";
document.addEventListener("DOMContentLoaded", async function () {
    const result = await showAllNFT();
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

});