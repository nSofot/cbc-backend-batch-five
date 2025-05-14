import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function createUser(req, res) {

    /*
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
*/

    const hashpassword = bcrypt.hashSync(process.env.JWT_KEY+req.body.password, 10);

    const user = new User({
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: hashpassword,
        role: req.body.role,
        isActive: req.body.isActive,
        Image: req.body.Image,
        createdAt: req.body.createdAt,
        updatedAt: req.body.updatedAt
    });

    user
    .save()
    .then(() => {
        res.json({
            message: "User added successfully"
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
    const password = process.env.JWT_KEY+req.body.password

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
                if(user.isActive) {
                    res.status(200).json({
                        message: "Login successful",
                        token : jwt.sign(
                        {
                            email: user.email,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            role: user.role,
                            Image: user.Image
                        },
                        process.env.JWT_KEY,
                        ),
                        role : user.role
                    })
                } else {
                    res.status(401).json({
                        message: "User is not active"
                    })
                }

            } else {
                res.status(401).json({
                    message: "Invalid password"
                })
            }   
        }}
    ))
}

export async function getUsers(req,res) {
    try{
        if(isAdmin(req)){
            const user = await User.find()
            res.json(products)
        }
        else{
            const user = await User.find({isActive : true})
            res.json(user)
        }

    }
    catch(err){
        res.status(500).json({
            message : "Error getting users",
            error: err
        })
    }
}


export function isAdmin(req) {
    if(req.user == null) {
        return false
    }

    if(req.user.role != "admin") {
        return false
    }

    // if(!req.user.isActive) {
    //     return false
    // }
    return true
}