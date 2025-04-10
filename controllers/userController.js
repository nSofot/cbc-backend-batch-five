import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export function createUser(req, res) {

    if(req.body.role != "admin") {
        if(req.user !=null){
            if(req.user.role != "admin") {
               res.status(403).json({
                   message : "You are not authorized to add admin account"
               })
               return
            }
        }
        else{
            res.status(403).json({
               message : "You are not authorized to add users. Please login first"
            })
            return
        }
    }


    const hashpassword = bcrypt.hashSync("Gorilla#2025"+req.body.password, 10);

    const user = new User({
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: hashpassword,
        role: req.body.role,
        status: req.body.status,
        Image: req.body.Image,
        createdAt: req.body.createdAt
    });
    
    user
    .save()
    .then(() => {
        res.json({
            message: "User added"
        });    
    })
    .catch(() => {
        res.json({
            message: "User not added"
        });
    })  
}

export function loginUsers(req, res) {
    const email = req.body.email
    const password = "Gorilla#2025"+req.body.password

    User.findOne({ email: email })
    .then(
    (user => {
        if (user == null) {
            res.status(404).json({
                message: "User not found"
            })
        } else {
            const isPasswordValid = bcrypt.compareSync(password, user.password)
            if (isPasswordValid) {
                const token = jwt.sign(
                {
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    role: user.role,
                    Image: user.Image
                },
                "nsoft-tec#2025",
                )
                res.status(200).json({
                    message: "Login successful",
                    token : token
                })
            } else {
                res.status(401).json({
                    message: "Invalid password"
                })
            }   
        }}
    ))
}

export function isAdmin(req) {
    if(req.user == null) {
        return false
    }

    if(req.user.role != "admin") {
        return false
    }
    return true
}