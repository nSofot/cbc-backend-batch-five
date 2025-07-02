import express from "express";
import { createUser, createGoogleUser, loginUsers, loginWithGoogle, sendOTP, resetPassword, getUser} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/create-google", createGoogleUser);
userRouter.post("/login", loginUsers);
userRouter.post("/login/google", loginWithGoogle);
userRouter.post("/send-OPT", sendOTP);
userRouter.post("/reset-password", resetPassword);
userRouter.get("/", getUser);

export default userRouter;