import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config(); // Load API key from .env

const app = express();
const port = 8000;


app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// async function listModels() {
//     const response = await fetch(
//         `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`
//     );
//     const data = await response.json();
//     console.log(data); // Check available models
// }

// listModels();


// Route to generate a response
app.post("/generate", async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const prompt = req.body.prompt; // Get user prompt from request
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        res.json({ response: text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get("/me", adminAuth, async (req, res) => {
    res.json({ id: req.user._id, role: req.user.role, name: req.user.name });
  });
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
