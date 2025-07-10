import express from "express";
import { createUser, createGoogleUser, loginUsers, loginWithGoogle, sendOTP, resetPassword, getUser, getAllUsers} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/create-google", createGoogleUser);
userRouter.post("/login", loginUsers);
userRouter.post("/login/google", loginWithGoogle);
userRouter.post("/send-OTP", sendOTP);
userRouter.post("/reset-password", resetPassword);
userRouter.get("/all-users", getAllUsers);
userRouter.get("/", getUser);

export default userRouter;