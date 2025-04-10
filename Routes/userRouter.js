import express from "express";
import { createUser } from "../controllers/userController.js";
import { loginUsers } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUsers);

export default userRouter;