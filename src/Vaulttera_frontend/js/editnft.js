import {
    showAllNFT,
    getUserInfo,
    updateNFT
} from "./motoko.js";
import {
    Principal
} from '@dfinity/principal';
document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get('id');
    const result = await showAllNFT(nftId);
    for (let [i, [id, nft]] of result.entries()) {
        if (id == nftId) {
            const userOwner = await getUserInfo(nft.owner);
            document.getElementById("title").innerHTML = "EDIT " + nft.name;
            document.getElementById("id").value = id;
            document.getElementById("nftname").value = nft.name;
            document.getElementById("Author").value = userOwner.ok.name;
            document.getElementById("description").value = nft.description;
            document.getElementById("category").value = nft.category;
            document.getElementById("price").value = nft.price;
            document.getElementById("slot").value = nft.slot;
            document.getElementById("benefit").value = nft.benefit;
            // Assuming `nft.image` contains the saved image path (e.g., "assets/img/your-nft.jpg")
            document.getElementById("newImg").src = nft.image || "assets/img/no-img.png";

            // Update image preview when a new file is selected
            document.getElementById("image").addEventListener("change", function (event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        document.getElementById("newImg").src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
            return;
        }
    };
});
document.getElementById("theform").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get form values
    const id = document.getElementById("id").value;
    const nftName = document.getElementById("nftname").value;
    const description = document.getElementById("description").value;
    const category = { [document.getElementById("category").value]: null };
    const price = document.getElementById("price").value;
    const slot = document.getElementById("slot").value;
    const benefit = document.getElementById("benefit").value;
    const imageFile = document.getElementById("image").files[0]; // Get file

    // Check if all fields are filled out
    if (!nftName || !description || !category || !price || !slot || !benefit) {
        alert("Please fill all fields and upload an image.");
        return;
    }

    let imagePath;
    if(imageFile){

        // Upload the image first and get the file path
         imagePath = await uploadImage(imageFile);
        
        if (!imagePath) {
            console.log("Failed to upload image.");
            return;
        }
    }
    else{
        imagePath = document.getElementById("newImg").src;
    }
        
    // Prepare NFT data with the file path
    const nftData = {
        name: nftName,
        description: description,
        category: category,
        owner: Principal.fromText(JSON.parse(sessionStorage.getItem("principal")).__principal__),
        price: Number(price),
        slot: Number(slot),
        benefit: benefit,
        image: imagePath,
    };

    // Send NFT data to your Motoko backend
    try {
        
        const result = await updateNFT(id, nftData); 
        
        if ("ok" in result) {
            alert("NFT updated successfully!");
            document.getElementById("theform").reset();
            document.getElementById("newImg").src = "assets/img/no-img.png"; // Reset preview image
        } else {
            console.log("Error: " + result.message);
        }
        location.href = "revenue.html";
    } catch (error) {
        console.error("Error creating NFT:", error);
        alert("Failed to create NFT.");
    }
});
// Function to upload image to the server
async function uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch("http://localhost:3000/uploadImage", { // Replace with your backend upload route
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (result.success) {
            return result.filePath; // Return the file path from the server
        } else {
            console.error("Image upload failed:", result.message);
            return null;
        }
    } catch (error) {
        console.error("Image upload failed:", error);
        return null;
    }
}

// Preview image before upload
document.getElementById("image").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("newImg").src = e.target.result; // Preview the selected image
        };
        reader.readAsDataURL(file);
    }
});
