import { HttpAgent, Actor, IDL } from '@dfinity/agent';

document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM Content Loaded");

    const canisterId = "by6od-j4aaa-aaaaa-qaadq-cai";
    console.log("Initializing IDL Factory");

    // IDL factory
    const idlFactory = ({ IDL }) => {
        return IDL.Service({
            getDummyUsername: IDL.Func([], [IDL.Text], ["query"]),
        });
    };

    // Create the agent
    const agent = new HttpAgent({ host: "http://127.0.0.1:4943" });
    agent.fetchRootKey().then(() => {
        console.log("Root key fetched successfully");
    }).catch((error) => {
        console.error("Error fetching root key:", error);
    });

    // Create the actor
    const actor = Actor.createActor(idlFactory, { agent, canisterId });

    async function fetchDummyUsername() {
        try {
            console.log("Fetching dummy username...");
            const username = await actor.getDummyUsername();
            document.getElementById("username").innerText = username;
            console.log("Fetched username:", username);
        } catch (error) {
            console.error("Error fetching dummy username:", error);
        }
    }

    // Call the function to fetch username
    fetchDummyUsername();
});
