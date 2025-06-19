import express from "express";
import { deleteProduct, getProducts, updateProduct } from "../controllers/productController.js";
import { saveProduct } from "../controllers/productController.js";
import { getProductById } from "../controllers/productController.js";
import { searchProducts } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.get("/search", searchProducts); // ✅ matches ?query=abc
productRouter.get("/:productId", getProductById);
productRouter.post("/", saveProduct);
productRouter.delete("/:productId", deleteProduct);
productRouter.put("/:productId", updateProduct);

export default productRouter;