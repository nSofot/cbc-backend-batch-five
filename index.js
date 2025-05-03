import express from "express";
import bodyParser from "body-parser";
import mongoose, { mongo } from "mongoose";
import productRouter from "./Routes/productRouter.js";
import userRouter from "./Routes/userRouter.js";
import orderRouter from "./Routes/orderRouter.js";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors())
app.use(bodyParser.json());

app.use(
    (req, res, next) => {
        const tokenString = req.header("Authorization")
        if(tokenString != null) {
            const token = tokenString.replace("Bearer ", "")
 
            jwt.verify(token, "nsoft-tec#2025",
            (err, decoded) => {
                if(decoded != null) {
                    req.user = decoded
                    next()
                } else {
                    res.status(403).json({
                        message : "Invalid token"
                    })
                }
            })
        } else {
            next()
        }
    }
)

//"mongodb+srv://admin:123@cluster0.ykfz5tz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log("Connected to database");
})
.catch(() => {
    console.log("Connection failed");
})



app.use("/api/product", productRouter);
app.use("/api/user", userRouter);
app.use("/api/user/login", userRouter);
app.use("/api/order", orderRouter);


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});