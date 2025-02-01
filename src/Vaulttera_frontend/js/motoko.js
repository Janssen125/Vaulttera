import {
    HttpAgent,
    Actor,
    IDL
} from '@dfinity/agent';
import {
    Principal
} from '@dfinity/principal';

// IDL factory
const idlFactory = ({
    IDL
}) => {
    const userInfo = IDL.Record({
        name: IDL.Text,
        email: IDL.Text,
        bioStatus: IDL.Text,
        password: IDL.Text,
    });

    const Result = IDL.Variant({
        ok: IDL.Null,
        err: IDL.Text,
    });

    return IDL.Service({
        getUserInfo: IDL.Func(
            [IDL.Principal],
            [
                IDL.Variant({
                    ok: IDL.Record({
                        name: IDL.Text,
                        email: IDL.Text,
                        bioStatus: IDL.Text,
                        password: IDL.Text,
                    }),
                    err: IDL.Text,
                }),
            ],
            ["query"]
        ),
        getBalance: IDL.Func([IDL.Principal], [IDL.Nat], ["query"]),
        getDummyUsername: IDL.Func([], [IDL.Text], ["query"]),
        createUser: IDL.Func([IDL.Principal, userInfo], [Result], []),
        addBalance: IDL.Func([IDL.Principal, IDL.Nat], [Result], []),
        checkEmail: IDL.Func(
            [IDL.Text],
            [IDL.Variant({
                ok: IDL.Principal,
                err: IDL.Text
            })],
            []
        ),
    });
};

const agent = new HttpAgent({
    host: "http://127.0.0.1:4943"
});
agent.fetchRootKey().then(() => {
    console.log("Root key fetched successfully");
}).catch((error) => {
    console.error("Error fetching root key:", error);
});

const canisterId = "bkyz2-fmaaa-aaaaa-qaaaq-cai";
const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId
});
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM Content Loaded");

    console.log("Initializing IDL Factory");
});

export async function getBalance() {
    const balance = await actor.getBalance({
        principal: actor.getPrincipal()
    });
    console.log(balance);
    return balance;
};

export async function fetchUserInfo() {
    try {
        const principal = sessionStorage.getItem("principal");
        if (!principal) {
            console.log("Principal not found in sessionStorage.");
            return;
        };
        const principalObject = Principal.fromText(principal);
        const result = await actor.getUserInfo(principalObject);
        if ("ok" in result) {
            const userInfo = result.ok;
            return userInfo;
        } else if ("err" in result) {
            return result.err;
        } else {
            console.log("Unexpected result format");
        };
    } catch (error) {
        console.log("Error Fetching Data..", error);
    };
};
async function createIdentity(identityName, newUser) {
    try {

        const response = await fetch("http://localhost:3000/create-identity", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                identityName
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("New Principal:", data.principal);

        if (!data.principal) {
            throw new Error("Principal creation failed");
        }

        const userPrincipal = Principal.fromText(data.principal);
        const registerUserResult = await actor.createUser(userPrincipal, newUser);

        if ("ok" in registerUserResult) {
            alert("User Registered Successfully");
            sessionStorage.setItem("principal", userPrincipal);
            location.href = "./index.html";
        } else {
            console.log("Error Registering User");
        }
    } catch (error) {
        console.error("Error creating identity:", error);
        console.log("An error occurred while creating identity.");
    }

};
export async function register(username, email, password) {

    const newUser = {
        name: username,
        email: email,
        bioStatus: "My Bio",
        password: password
    };
    console.log(email);

    try {
        const check = await actor.checkEmail(email);
        console.log(check);

        if (!check) {
            alert("Error: Check result is undefined or null.");
            return;
        }
        if ("ok" in check) {
            alert("Email Already Exists");
        } else if ("err" in check) {
            const userPrincipal = createIdentity(email.value, newUser);
            const registerUserResult = await actor.createUser(userPrincipal, newUser);
            if ("ok" in registerUserResult) {
                alert("User Registered Successfully");
                sessionStorage.setItem("principal", userPrincipal);
            } else {
                alert("Error Registering User");
            }
        }
    } catch (error) {
        console.log("Error during registration:", error);
        console.log("An error occurred during registration.");
    };
};

export async function login(lemail, lpassword) {
    try {
        const emailCheck = await actor.checkEmail(lemail);
        console.log(emailCheck);
        if ("ok" in emailCheck) {
            console.log(emailCheck.ok.toText());

            const userInfo = await actor.getUserInfo(emailCheck.ok);
            console.log(userInfo);

            console.log(userInfo.ok.password);
            console.log(lpassword);
            if (userInfo.ok.password == lpassword) {
                sessionStorage.setItem("principal", JSON.stringify(emailCheck.ok));
                alert("Login Success");
                location.href = "./index.html";
            } else {
                alert("Incorrect Password");
            }
        } else {
            alert("Email or Password Incorrect");
        }
    } catch (error) {
        console.log("Error during login:", error);
    }
};

export async function checkGoogle() {
    const data = sessionStorage.getItem("google");
    const noJsonData = JSON.parse(data);
    const emailCheck = await actor.checkEmail(noJsonData.email);
    console.log(emailCheck);
    if ("ok" in emailCheck) {
        const user = actor.getUserInfo(emailCheck);
        console.log(user);

        sessionStorage.setItem(JSON.stringify(user));
    } else if ("err" in emailCheck) {
        const username = noJsonData.name;
        const email = noJsonData.email;
        const password = "googleAuth";
        register(username, email, password);
    };
};