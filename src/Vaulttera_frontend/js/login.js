let googleUser; // Store the signed-in user

// Initialize the Google Sign-In
function handleCredentialResponse(response) {
  const data = jwt_decode(response.credential); // Decode the JWT token to get user info
  console.log("ID: " + data.sub);
  console.log("Name: " + data.name);
  console.log("Email: " + data.email);

  // Populate user info on the UI
  document.getElementById("name").innerHTML = data.name;
  document.getElementById("image").src = data.picture;
  document.getElementById("email").innerHTML = data.email;

  googleUser = data; // Store the user
}

// Sign-out function
function signOut() {
  google.accounts.id.disableAutoSelect(); // Disable auto-select if any
  googleUser = null; // Clear the user data

  // Reset UI
  document.getElementById("name").innerHTML = '';
  document.getElementById("image").src = '';
  document.getElementById("email").innerHTML = '';
  console.log("User signed out.");
}

// Initialize Google Sign-In button
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

  // document.getElementById("register").disabled = true;
  // document.getElementById("identityLogin").disabled = true;
};

// function checkBox() {
//   let username = document.getElementById("username").value.trim();
//   let email = document.getElementById("email").value.trim();
//   let password = document.getElementById("password").value.trim();

  // Enable Login button if username & email are filled
  // if (username !== "" && email !== "") {
  //   document.getElementById("identityLogin").disabled = false;
  // } else {
  //   document.getElementById("identityLogin").disabled = true;
  // }

  // Enable Register button if all fields are filled
//   if (username !== "" && email !== "" && password !== "") {
//     document.getElementById("register").disabled = false;
//   } else {
//     document.getElementById("register").disabled = true;
//   }
// }