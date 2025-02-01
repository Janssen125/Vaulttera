import express from "express";
import cors from "cors";
import { execSync } from "child_process";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/create-identity", (req, res) => {
    try {
        const identityName = req.body.identityName;
        console.log("Creating identity:", identityName);

        // Ensure we create without encryption (avoiding password prompt)
        execSync(`dfx identity new ${identityName} --disable-encryption`);
        execSync(`dfx identity use ${identityName}`);
        
        const principal = execSync("dfx identity get-principal").toString().trim();
        execSync(`dfx identity use ic-identity`);
        console.log("Generated Principal:", principal);
        res.json({ principal });

    } catch (error) {
        console.error("Error executing DFX commands:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
