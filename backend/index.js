import express from "express";
import 'dotenv/config';
import userRoutes from './routes/userRoutes.js'
import VideoRoutes from './routes/VideoRoutes.js'
import connectDb from "./database/db.js";
import cookieParser from "cookie-parser";
import cloudinary from 'cloudinary'
import songRoutes from './routes/songRoutes.js'
import path from "path";

// dotenv.config()

cloudinary.v2.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Cloud_Api,
    api_secret: process.env.Cloud_Secret,
});

const app = express()
const port = process.env.PORT

//using middlewares
app.use(express.json());
app.use(cookieParser());

//import routes
app.use("/api/user", userRoutes);
app.use("/api/song", songRoutes);
app.use("/api/video", VideoRoutes);

const __dirname = path.resolve()

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*",(req,res) =>{
    res.sendFile(path.join(__dirname, "frontend","dist","index.html"));
})

app.listen(port, () => {
    console.log(`server started on ${port}`);
    connectDb();
})