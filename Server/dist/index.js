import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from './router/route.js';
import { connectToDB } from "./lib/database.js";
dotenv.config();
const app = express();
const port = 5000;
app.use(express.json());
app.use(cors());
connectToDB();
app.get("/", (req, res) => {
    res.send("Base route");
});
app.use("/api", router);
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
