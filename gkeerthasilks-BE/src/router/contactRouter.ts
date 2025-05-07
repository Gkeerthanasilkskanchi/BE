import express from "express";
import { registerUser, loginUser } from "../service/authService";
import { addToCartService, createProduct, fetchProducts, getCart, getLikedProducts, likeProductService } from "../service/productService";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/products", createProduct);     // To add a new product
router.get("/products", fetchProducts);      // To fetch all products
router.post("/like", likeProductService);
router.get("/likes/:userId", getLikedProducts);

router.post("/cart", addToCartService);
router.get("/cart/:userId", getCart);

export { router as userRoutes };
