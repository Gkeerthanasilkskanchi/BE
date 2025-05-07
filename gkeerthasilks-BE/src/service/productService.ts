import { Request, Response, NextFunction } from "express";
import { addProduct, getAllProducts } from "../repository/contactRepo"; // or productRepo.ts
import { likeProduct, getLikedProductsByUser, addToCart, getCartByUser } from "../repository/contactRepo";

// Add a new product
export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { image, title, price, about, cloth, category, bought_by, saree_type } = req.body;

  try {
    if (!image || !title || !price || !about || !cloth || !category || !bought_by || !saree_type) {
      return res.status(400).json({ message: "All fields are required." });
    }

    await addProduct(image, title, price, about, cloth, category, bought_by, saree_type);
    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    next(error);
  }
};

// Get all products
export const fetchProducts = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const products = await getAllProducts(); // In case you make it async in the repo
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};


// Like a product
export const likeProductService = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { userId, productId } = req.body;
  try {
    likeProduct(userId, productId);
    res.status(200).json({ message: "Product liked" });
  } catch (err) {
    next(err);
  }
};

// Get liked products
export const getLikedProducts = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const userId = parseInt(req.params.userId);
  try {
    const products = getLikedProductsByUser(userId);
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

// Add to cart
export const addToCartService = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { userId, productId, quantity } = req.body;
  try {
    addToCart(userId, productId, quantity || 1);
    res.status(200).json({ message: "Added to cart" });
  } catch (err) {
    next(err);
  }
};

// Get cart
export const getCart = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const userId = parseInt(req.params.userId);
  try {
    const cart = getCartByUser(userId);
    res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
};
