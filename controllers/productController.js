import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function getProducts(req,res) {
    try{
        if(isAdmin(req)){
            const products = await Product.find()
            res.json(products)
        }
        else{
            const products = await Product.find({isAvailable : true})
            res.json(products)
        }

    }
    catch(err){
        res.status(500).json({
            message : "Error getting products",
            error: err
        })
    }
}

export function saveProduct(req, res) {

    if(!isAdmin(req))
    {
        res.status(403).json({
            message : "You are not authorized to add products"
        })
        return
    } 

    const product = new Product
    (
        req.body
    );

    product
        .save()
        .then(() => {
            res.json({
                message: "Product added"
            });
        })
        .catch(() => {
            res.json({
                message: "Product not added"  
            });
    })
}   

export async function deleteProduct(req, res) {
    if(!isAdmin(req))
    {
        res.status(403).json({
            message : "You are not authorized to delete products"
        })
        return
    } 

    try{
        await Product.deleteOne({productId : req.params.productId})

        res.json({
            message : "Product deleted successfully"
        })
    }
    catch(err){
        res.status(500).json({
            message : "Failed to delete product",
            error: err
        })
    }
}

export async function updateProduct(req, res) {
    if(!isAdmin(req))
    {
        res.status(403).json({
            message : "You are not authorized to update products"
        })
        return
    }   

    try{
        await Product.updateOne({productId : req.body.productId},req.body)

        res.json({    
            message : "Product updated successfully"
        })
    }
    catch(err){
        res.status(500).json({
            message : "Failed to update product",
            error: err
        })
    }
}