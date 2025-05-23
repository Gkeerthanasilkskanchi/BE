import express from "express";
import { registerUser, loginUser, getUser } from "../service/authService";
import { addToCartService, createProduct, fetchProducts, getCart, getLikedProducts, likeProductService, sendQuery } from "../service/productService";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/products", createProduct);     
router.get("/products", fetchProducts);     
router.post("/like", likeProductService);
router.get("/likes/:userId", getLikedProducts);

router.post("/cart", addToCartService);
router.get("/cart/:userId", getCart);


router.post('/send-query',sendQuery)

router.post('/send-review',sendQuery)
router.post('/send-subscribtion',sendQuery)
router.get('/get-user-list',getUser);

export { router as userRoutes };
