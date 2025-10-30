import express from "express";
import cors from "cors";
import db from "./config/db.js";
import index from "./routes/index.js";

const app = express();

app.use("/api", index);

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));