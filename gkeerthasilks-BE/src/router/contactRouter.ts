import express from "express";
import { registerUser, loginUser, getUser } from "../service/authService";
import { addOrder, addToCartService, createProduct, fetchProducts, getCart, getLikedProducts, getProductsSoldThisWeekService, getProductsSoldTodayService, getRevenueThisMonthService, getSalesByCategoryService, getWeeklySalesDataService, likeProductService, sendQuery } from "../service/productService";
import { createOrder } from "../repository/contactRepo";

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
router.get("/create-order", addOrder);

router.get("/getProductsSoldTodayService", getProductsSoldTodayService);


router.get('/getProductsSoldThisWeekService',getProductsSoldThisWeekService)

router.get('/getRevenueThisMonthService',getRevenueThisMonthService)
router.get('/getWeeklySalesDataService',getWeeklySalesDataService)
router.get('/getSalesByCategoryService',getSalesByCategoryService);

export { router as userRoutes };
