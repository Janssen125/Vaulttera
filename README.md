# Vaulttera

<h1>Welcome To Vaulttera!!!</h1>
Vaulttera is a cutting-edge platform where digital ownership meets seamless accessibility. By integrating Web3 technology with a simple, user-friendly interface, Vaulttera allows users to connect their wallets or enjoy token-gated content without the need for a blockchain wallet. This means everyone—from Web2 newcomers to blockchain enthusiasts—can interact with exclusive content and NFTs (Non-Fungible Tokens) effortlessly.

<h1>Progress:</h1>

- [x] Google Sign In
- [x] Login Page, Register Page, Change Password
- [x] Landing Page
- [x] NFT List
- [x] NFT Detail
- [x] Profile
- [x] Revenue
- [x] NFT Buy/Sell
- [x] Wallet

<h1>Requirement</h1>
Node.js (https://nodejs.org/en/download)<br>
dfx (https://internetcomputer.org/docs/current/developer-docs/getting-started/install/)<br>
ngrok (if want to use google sign in) (https://download.ngrok.com/downloads/windows?tab=download)<br>

<h1>Running Guide</h1>

1. Clone repository
2. Open new wsl Terminal
3. Run "dfx start", do "dfx start --background" if you want to start it in the background
4. Open new wsl Terminal
5. Run "dfx deploy", do "dfx deploy <canister>" to specify the canister
6. Type "npm install express multer"
7. Run ngrok in cmd, type "ngrok http <your_local_web_server>" example: "ngrok http 127.0.0.1:5500" or "ngrok http 80" (for localhost)
8. Open new wsl at "Vaulttera/src/Vaulttera_frontend/js"
9. Type "node server.js"

<h2>Use Google Sign In Guide</h2>

Video Reference https://youtu.be/PctSxrQ3JrI

1. Open https://console.cloud.google.com/apis/
2. Create a new project
3. Create a new OAuth client ID
4. Create the Credentials (Authorized Javascript Origins = your ngrok URL, example: https://d923-103-171-154-236.ngrok-free.app. Authorized redirect URls = your index.html, example: https://d923-103-171-154-236.ngrok-free.app/src/Vaulttera_frontend/)
5. Copy Client ID
6. Open Vaulttera_frontend/js/google.js
7. Edit the client_id at line 34 with your client ID
