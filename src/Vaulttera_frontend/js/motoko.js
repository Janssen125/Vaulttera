import {
    HttpAgent,
    Actor,
    IDL
} from '@dfinity/agent';
import {
    Principal
} from '@dfinity/principal';
import {
    AuthClient
} from "@dfinity/auth-client";
import {
    createActor
} from "../../declarations/Vaulttera_backend/index.js";
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM Content Loaded");

    const canisterId = "bnz7o-iuaaa-aaaaa-qaaaa-cai";
    console.log("Initializing IDL Factory");

    // IDL factory
    const idlFactory = ({
        IDL
    }) => {
        return IDL.Service({
            getUserInfo: IDL.Func([IDL.Principal], [IDL.Variant({
                ok: IDL.Record({
                    name: IDL.Text,
                    email: IDL.Text,
                    bioStatus: IDL.Text
                }),
                err: IDL.Text
            })], ["query"]),
            getBalance: IDL.Func([IDL.Principal], [IDL.Nat], ["query"]),
            getDummyUsername: IDL.Func([], [IDL.Text], ["query"]),
            createUser: IDL.Func(
                [IDL.Principal, IDL.Record({
                    name: IDL.Text,
                    email: IDL.Text,
                    bioStatus: IDL.Text
                })],
                [IDL.Variant({
                    ok: IDL.Null,
                    err: IDL.Text
                })],
                []
            ),
            addBalance: IDL.Func([IDL.Principal, IDL.Nat], [IDL.Variant({
                ok: IDL.Null,
                err: IDL.Text
            })], []),
        })
    }

    // Create the agent
    const agent = new HttpAgent({
        host: "http://127.0.0.1:4943"
    });
    agent.fetchRootKey().then(() => {
        console.log("Root key fetched successfully");
    }).catch((error) => {
        console.error("Error fetching root key:", error);
    });

    // Create the actor
    let actor = Actor.createActor(idlFactory, {
        agent,
        canisterId
    });

    async function fetchUserInfo() {
        try {
            const principal = sessionStorage.getItem("principal");
            const principalObject = Principal.fromText(principal);

            const result = await actor.getUserInfo(principalObject);

            if ("ok" in result) {
                console.log(userInfo.name);
                const userInfo = result.ok;
                document.getElementById("username").innerText = userInfo.name;
                document.getElementById("email").innerHTML = userInfo.email;
                document.getElementById("bio").innerHTML = userInfo.bioStatus;
                const balance = await actor.getBalance(principalObject);
                document.getElementById("balance").innerHTML = balance;
            } else if ("err" in result) {
                document.getElementById("username").innerText = 'Error: ${result.err}';
                document.getElementById("email").innerText = 'Error: ${result.err}';
                document.getElementById("bio").innerText = 'Error: ${result.err}';
                document.getElementById("balance").innerText = 'Error: ${result.err}';
            } else {
                console.log("Nuh uh");
            }
        } catch (error) {
            console.log("Error Fetching Data..");
        }
    }
    fetchUserInfo();

    function register() {
        let username = document.getElementById("username");
        let email = document.getElementById("email");
        let password = document.getElementById("password");
      
        let newUser = {
          name: username.value,
          email: email.value,
          password: password.value
        };

        
      }

    // const greetButton = document.getElementById("greet");
    // greetButton.onclick = async (e) => {
    //     e.preventDefault();

    //     greetButton.setAttribute("disabled", true);

    //     // Interact with backend actor, calling the greet method
    //     const greeting = await actor.getDummyUsername();

    //     greetButton.removeAttribute("disabled");

    //     console.log(greeting);

    //     return false;
    // };

    // const loginButton = document.getElementById("identityLogin");
    // loginButton.onclick = async (e) => {
    //     e.preventDefault();

    //     // create an auth client
    //     let authClient = await AuthClient.create();

    //     console.log(process.env.II_URL);


    //     // start the login process and wait for it to finish
    //     await new Promise((resolve) => {
    //         authClient.login({
    //             identityProvider: "http://127.0.0.1:5500",
    //             onSuccess: resolve,
    //         });
    //     });

    //     // At this point we're authenticated, and we can get the identity from the auth client:
    //     const identity = authClient.getIdentity();
    //     const principal = identity.getPrincipal().toText();
    //     // Using the identity obtained from the auth client, we can create an agent to interact with the IC.
    //     const agent = new HttpAgent({
    //         host: "http://127.0.0.1:5500",
    //         identity
    //     });

    //     // Using the interface description of our webapp, we create an actor that we use to call the service methods.
    //     actor = Actor.createActor(idlFactory, {
    //         agent,
    //         canisterId,
    //     });

    //     console.log(document.getElementById("username")); // Should NOT be null
    //     console.log(document.getElementById("username").value); // Should return the input value

    //     let userInfo = {
    //         name: document.getElementById("username").value,
    //         email: document.getElementById("email").value,
    //         bioStatus: "My Bio",
    //     }
    //     console.log("Caller: ", identity.getPrincipal().toString());
    //     try {
    //         const result = await actor.createUser(identity.getPrincipal(), userInfo);
    //         const balanceAdd = await actor.addBalance(principal, 1000); 
    //         console.log("User created:", result);
    //         sessionStorage.setItem("principal", principal);
    //         alert("Success");
    //     } catch (error) {
    //         console.error("Error:", error);
    //     }

    //     return false;
    // };
});