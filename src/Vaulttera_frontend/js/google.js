let googleUser; // Store the signed-in user
// Initialize the Google Sign-In
function handleCredentialResponse(response) {
  const data = jwt_decode(response.credential);
  console.log(response);
  
  console.log("ID: " + data.sub);
  console.log("Name: " + data.name);
  console.log("Email: " + data.email);

  let newUser = {
    id: data.sub,
    name: data.name,
    email: data.email,
    picture: data.picture,
  };

  // Populate user info on the UI
//   document.getElementById("name").innerHTML = data.name;
//   document.getElementById("image").src = data.picture;
//   document.getElementById("email").innerHTML = data.email;

  googleUser = data;
  
  sessionStorage.setItem("google", JSON.stringify(newUser));
  location.href = "login.html";
}

// Sign-out function
function signOut() {
  google.accounts.id.disableAutoSelect(); // Disable auto-select if any
  googleUser = null; // Clear the user data
  console.log("User signed out.");
}

window.onload = function () {

google.accounts.id.initialize({
    client_id: "152088522004-5fp0571nfpn52097ajd9s0d1mf8m7vpe.apps.googleusercontent.com", // Replace with your client ID
    callback: handleCredentialResponse
  });

  google.accounts.id.renderButton(
    document.getElementById("google-sign-in-button"), // Render the button in this container
    {
      theme: "outline",
      size: "large"
    }
  );
};
