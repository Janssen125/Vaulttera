import { HttpAgent, Actor, IDL } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

document.addEventListener("DOMContentLoaded", function () {
            console.log("DOM Content Loaded");

            const canisterId = "bkyz2-fmaaa-aaaaa-qaaaq-cai";
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
                });
            };

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
            const actor = Actor.createActor(idlFactory, {
                agent,
                canisterId
            });

            async function fetchUserInfo() {
                try {
                    const principal = sessionStorage.getItem("principal");
                    const principalObject = Principal.fromText(principal);

                    const result = await actor.getUserInfo(principalObject);

                    if ("ok" in result) {
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
                    }
                    else {
                        console.log("Nuh uh");
                    }
                } catch (error) {
                    console.log("Error Fetching Data..");
                }
            }
            fetchUserInfo();
        }
    );