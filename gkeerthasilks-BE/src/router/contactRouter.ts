import express from "express";
import { registerUser, loginUser, getUser } from "../service/authService";
import { addOrder, addToCartService, createProduct, deleteProduct, fetchProducts, getCart, getFilteredProduct, getLikedProducts, getProductsSoldThisWeekService, getProductsSoldTodayService, getRevenueThisMonthService, getSalesByCategoryService, getWeeklySalesDataService, likeProductService, search, sendQuery, updateProduct } from "../service/productService";
import { createOrder, editProduct } from "../repository/contactRepo";
import { upload } from "./middleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/products",upload.single('image'), createProduct);     
router.get("/products", fetchProducts);     
router.post("/like", likeProductService);
router.get("/likes/:userId", getLikedProducts);

router.post("/cart", addToCartService);
router.get("/cart/:userId", getCart);


router.post('/send-query',sendQuery)

router.post('/send-review',sendQuery)
router.post('/send-subscribtion',sendQuery)
router.get('/get-user-list',getUser);
router.post("/create-order", addOrder);

router.get("/getProductsSoldTodayService", getProductsSoldTodayService);


router.get('/getProductsSoldThisWeekService',getProductsSoldThisWeekService)

router.get('/getRevenueThisMonthService',getRevenueThisMonthService)
router.get('/getWeeklySalesDataService',getWeeklySalesDataService)
router.get('/getSalesByCategoryService',getSalesByCategoryService);



router.get('/deleteProduct',deleteProduct);
router.get('/editProduct',updateProduct);
router.get('/search',search);
router.get('/getFilteredProduct',getFilteredProduct);
export { router as userRoutes };
