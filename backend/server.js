import express from "express";
import authRoutes from "./routes/authRoutes.js"
import dotenv from "dotenv";
import connectMongoDB from "./db/mongodb.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();


app.use(express.json()); 
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


const port = process.env.PORT || 8000;

app.use("/api/auth", authRoutes);

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
    connectMongoDB();
})