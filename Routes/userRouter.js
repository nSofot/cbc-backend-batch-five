import express from "express";
import { createUser, loginUsers, loginWithGoogle, sendOTP, resetPassword} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUsers);
userRouter.post("/login/google", loginWithGoogle);
userRouter.post("/send-OPT", sendOTP);
userRouter.post("/reset-password", resetPassword);

export default userRouter;