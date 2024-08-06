import express from "express";
import authRoutes from "./routes/authRoutes.js"
import dotenv from "dotenv";
import connectMongoDB from "./db/mongodb.js";


dotenv.config();



const app = express();

const port = process.env.PORT || 8000;

app.use("/api/auth", authRoutes);

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
    connectMongoDB();
})