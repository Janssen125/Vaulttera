import {  getUserInfo, createNFT } from "./motoko.js";
import {
    Principal
} from '@dfinity/principal';
document.addEventListener("DOMContentLoaded", async function () {
    const principal = Principal.fromText(JSON.parse(sessionStorage.getItem("principal")).__principal__);
    const user = await getUserInfo(principal);
    document.getElementById("Author").value = user.ok.name;
});

document.getElementById("theform").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get form values
    const nftName = document.getElementById("nftname").value;
    const description = document.getElementById("description").value;
    const category = { [document.getElementById("category").value]: null };
    const price = document.getElementById("price").value;
    const slot = document.getElementById("slot").value;
    const benefit = document.getElementById("benefit").value;
    const imageFile = document.getElementById("image").files[0]; // Get file

    // Check if all fields are filled out
    if (!nftName || !description || !category || !price || !slot || !benefit || !imageFile) {
        alert("Please fill all fields and upload an image.");
        return;
    }

    // Upload the image first and get the file path
    const imagePath = await uploadImage(imageFile);

    if (!imagePath) {
        alert("Failed to upload image.");
        return;
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
        image: imagePath, // The path to the uploaded image
    };

    // Send NFT data to your Motoko backend
    try {
        const randomID = generateRandomID(8); // Generate random ID
        
        alert("NFT created Successfully");
        // Simulating creating NFT on backend (replace with actual call to Motoko backend)
        const result = await createNFT(randomID, nftData); 
        
        location.href = "revenue.html";
        if (result.success) {
            alert("NFT created successfully!");
            document.getElementById("theform").reset();
            document.getElementById("newImg").src = "assets/img/no-img.png"; // Reset preview image
        } else {
            alert("Error: " + result.message);
        }
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

// Utility function to generate a random ID
function generateRandomID(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}