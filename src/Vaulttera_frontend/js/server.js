import express from "express";
import cors from "cors";
import { execSync } from "child_process";
import multer  from "multer";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('assets'));

const storage = multer.diskStorage({
    destination: "../assets/img",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

app.post("/uploadImage", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "File upload failed" });
    }
    const filePath = `./assets/img/${req.file.filename}`; // Relative file path
    res.json({ success: true, filePath });
});

app.post("/create-identity", (req, res) => {
    try {
        const identityName = req.body.identityName;
        console.log("Creating identity:", identityName);

        execSync(`dfx identity new ${identityName} --disable-encryption`);
        execSync(`dfx identity use ${identityName}`);
        
        const principal = execSync("dfx identity get-principal").toString().trim();
        execSync(`dfx identity use default`);
        console.log("Generated Principal:", principal);
        res.json({ principal });

    } catch (error) {
        console.error("Error executing DFX commands:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
