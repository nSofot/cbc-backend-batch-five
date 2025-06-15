import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
import nodemailer from "nodemailer";
import OTP from "../models/otp.js";
dotenv.config();

export async function createUser(req, res) {
    try {
        if (req.body.role === "admin") {
            if (!req.user || req.user.role !== "admin") {
                return res.status(403).json({ message: "You are not authorized to add admin account" });
            }
        } else {
            if (!req.user) {
                return res.status(403).json({ message: "You are not authorized to add users. Please login first" });
            }
        }

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const hashpassword = bcrypt.hashSync(process.env.JWT_KEY + req.body.password, 10);

        const user = new User({
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: hashpassword,
            role: req.body.role,
            isActive: req.body.isActive,
            Image: req.body.Image,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await user.save();
        res.json({ message: "User added successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "User not added", error: err });
    }
}

export async function loginUsers(req, res) {
    const { email, password } = req.body;
    const hashedInput = process.env.JWT_KEY + password;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isPasswordValid = bcrypt.compareSync(hashedInput, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid password" });

        if (!user.isActive) return res.status(401).json({ message: "User is not active" });

        const token = jwt.sign({
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role,
            Image: user.Image
        }, process.env.JWT_KEY);

        res.status(200).json({ message: "Login successful", token, role: user.role });

    } catch (err) {
        res.status(500).json({ message: "Login failed", error: err });
    }
}

export async function getUsers(req, res) {
    try {
        const users = isAdmin(req) ? await User.find() : await User.find({ isActive: true });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Error getting users", error: err });
    }
}


export async function loginWithGoogle(req, res) {
    const token = req.body.accessToken;

    if (!token) {
        return res.status(400).json({ message: "Access token is required" });
    }

    try {
        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const { email, given_name, family_name, picture } = response.data;

        let user = await User.findOne({ email });

        res.json({
            message: "Login successful",
            token: jwtToken,
            role: user.role,
        });
    } catch (err) {
        console.error("Google Login Failed:", err.response?.data || err.message);
        res.status(500).json({ message: "Google login failed", error: err.message });
    }
}


const transport = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: "nihalranathunge@gmail.com",
        pass: "aiwuodcdqxauehqi"
    }
});



export async function sendOTP(req, res) {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        await OTP.deleteMany({ email });

        const randomOTP = Math.floor(100000 + Math.random() * 900000);

        const otpDoc = new OTP({ email, otp: randomOTP });
        await otpDoc.save();

        const message = {
            from: process.env.EMAIL,
            to: email,
            subject: "Reset Password - Crystal Beauty Clear",
            text: `Your password reset OTP is: ${randomOTP}. This OTP will expire in 10 minutes.`,
        };

        await transport.sendMail(message);

        res.json({ message: "OTP sent successfully" });
    } catch (err) {
        console.error("Error sending OTP:", err);
        res.status(500).json({ message: "Failed to send OTP", error: err.message });
    }
}


export async function resetPassword(req, res) {
    const { email, otp, newPassword } = req.body;

    try {
        const otpDoc = await OTP.findOne({ email });
        if (!otpDoc) return res.status(404).json({ message: "No OTP requests found. Please try again." });

        if (String(otp) !== String(otpDoc.otp)) {
            return res.status(403).json({ message: "OTPs do not match" });
        }

        await OTP.deleteMany({ email });

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        await User.updateOne({ email }, { password: hashedPassword });

        res.json({ message: "Password has been reset successfully" });

    } catch (err) {
        res.status(500).json({ message: "Failed to reset password", error: err });
    }
}

export function isAdmin(req) {
    return req.user && req.user.role === "admin";
}
