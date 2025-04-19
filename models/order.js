import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderId : {
        type : String, 
        required : true, 
        unique : true
    },
    email : {
        type : String, 
        required : true
    },
    name : {
        type : String, 
        required : true
    },
    address : {
        type : String, 
        required : true
    },
    phone : {
        type : String, 
        required : true
    },
    status : {
        type : String, 
        required : true,
        default : "Pending"
    },
    total : {
        type : Number, 
        required : true
    },
    labelledTotal : {
        type : Number, 
        required : true
    },
    products : [
        {
            productInfo : {
                productId : {
                    type : String, 
                    required : true
                },
                name : {
                    type : String, 
                    required : true
                },
                price : {
                    type : Number, 
                    required : true
                },
                quantity : {
                    type : Number, 
                    required : true
                }
            }

        }
    ],
    createdAt : {
        type : Date, 
        default : Date.now
    }
})

const Order = mongoose.model("Order", orderSchema);

export default Order