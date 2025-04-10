import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },   
    firstname: { 
        type: String, 
        required: true 
    },
    lastname: { 
        type: String, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        required: true, 
        default: "User" 
    },
    status: { 
        type: String, 
        required: true, 
        default: "Active" 
    },
    Image: { 
        type: String, 
        required: false, 
        default: "https://avatar.iran.liara.run/public/boy?username=Ash"},
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const User = mongoose.model("User", userSchema);

export default User;