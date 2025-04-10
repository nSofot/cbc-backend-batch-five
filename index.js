import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import productRouter from "./Routes/productRouter.js";
import userRouter from "./Routes/userRouter.js";
import jwt from "jsonwebtoken";


const app = express();

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


//mongodb+srv://admin:<db_password>@cluster0.kglmvyg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
mongoose.connect("mongodb+srv://admin:123@cluster0.kglmvyg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    console.log("Connected to database");
})
.catch(() => {
    console.log("Connection failed");
})



app.use("/product", productRouter);
app.use("/user", userRouter);
app.use("/user/login", userRouter);


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});