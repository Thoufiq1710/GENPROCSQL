import express from "express";
import cors from "cors";
import db from "./config/db.js";
import index from "./routes/index.js";

// Corrected import path
import fieldTypeRoutes from "./modules/codePageTool/FieldTypes/fieldTypeRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", index);
app.use("/api/field-type", fieldTypeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
