import { Request, Response, NextFunction } from "express";
import { addProduct, createOrder, getAllProducts, getProductsSoldThisWeek, getProductsSoldToday, getRevenueThisMonth, getSalesByCategory, getWeeklySalesData } from "../repository/contactRepo"; // or productRepo.ts
import { likeProduct, getLikedProductsByUser, addToCart, getCartByUser,getUserIdByEmail } from "../repository/contactRepo";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Add a new product
export const createProduct = async (req: any, res: Response, next: NextFunction): Promise<any> => {
  const { title, price, about, cloth, category, bought_by, saree_type } = req.body;
  const file = req.file;

  if (!file || !title || !price || !about || !cloth || !category || !bought_by || !saree_type) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const imagePath = file.path; // Store path to uploaded file

  try {
    await addProduct(imagePath, title, parseFloat(price), about, cloth, category, bought_by, saree_type);
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
  const { email, productId } = req.body;
  try {
    const userId :any= getUserIdByEmail(email);
    
    await likeProduct(userId, productId);
    res.status(200).json({ message: "Product liked" });
  } catch (err) {
    next(err);
  }
};

// Get liked products
export const getLikedProducts = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const email :any= parseInt(req.params.userId);
  try {    
    const userId:any = getUserIdByEmail(email);
    const products =await getLikedProductsByUser(userId);
    
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

// Add to cart
export const addToCartService = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { email, productId, quantity } = req.body;
  try {

    console.log(email)
    const userId :any = getUserIdByEmail(email);
    console.log(userId)
   await addToCart(userId, productId, quantity || 1);
    res.status(200).json({ message: "Added to cart" });
  } catch (err) {
    next(err);
  }
};

// Get cart
export const getCart = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const email :any= parseInt(req.params.email);
  try {
    const userId:any = getUserIdByEmail(email);
    const cart = await getCartByUser(userId);
    res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
};




export const sendQuery = async (request: Request, response: Response) :Promise<any>=> {
    try {

        // Check if environment variables are properly set
        if (!process.env.BE_EMAIL || !process.env.BE_PASSWORD) {
            return response.status(500).json({ error: "Email credentials missing. Please check server logs." });
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.BE_EMAIL,
                pass: process.env.BE_PASSWORD, // Ensure this is correct
            },
        });

        let mailOptions;

        if (request?.body?.mobileNumber) {
            // Sending a query email
            mailOptions = {
                from: process.env.BE_EMAIL,
                to: process.env.BE_EMAIL, // Receiving email
                subject: "Demo Request for Product",
                html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                  <h2 style="color:#a4204d;">You have a new demo request for Product</h2>
              
                  <p style="font-size: 16px; color: #555;"><strong>Name :</strong> ${request?.body?.name}</p>
                  <p style="font-size: 16px; color: #555;"><strong>Email ID :</strong> ${request.body?.email}</p>
                  <p style="font-size: 16px; color: #555;"><strong>Mobile Number :</strong> ${request?.body?.mobileNumber}</p>
                  <p style="font-size: 16px; color: #555;"><strong>Request For :</strong> ${request?.body?.requestFor }</p>
                  <p style="font-size: 16px; color: #555;"><strong>Time and Date :</strong> ${request?.body?.date}</p>
              
                  <hr style="border: 1px solid #ddd; margin: 20px 0;"/>
              
              
                </div>
              `
              
            };
        }  else if (request?.body?.review) {
          // Sending a query email
          mailOptions = {
              from: process.env.BE_EMAIL,
              to: process.env.BE_EMAIL, // Receiving email
              subject: "Review Product",
              html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color:#a4204d;">You have a new review about Product</h2>
            
                <p style="font-size: 16px; color: #555;"><strong>Name :</strong> ${request?.body?.name}</p>
                <p style="font-size: 16px; color: #555;"><strong>Email ID :</strong> ${request.body?.email}</p>
                <p style="font-size: 16px; color: #555;"><strong>Mobile Number :</strong> ${request?.body?.mobileNumber}</p>
                <p style="font-size: 16px; color: #555;"><strong>Review :</strong> ${request?.body?.review }</p>
                <p style="font-size: 16px; color: #555;"><strong>Stars :</strong> ${request?.body?.stars}</p>
            
                <hr style="border: 1px solid #ddd; margin: 20px 0;"/>
            
            
              </div>
            `
            
          };
      } else {
            mailOptions = {
                from: process.env.BE_EMAIL,
                to: process.env.BE_EMAIL, // Receiving email
                subject: "User Subscribtion",
                text: `You have a new user:
                    EmailId: ${request?.body?.email}`
            };
        }

        await transporter.sendMail(mailOptions);

        return response.status(200).json({ message: "Email sent successfully!" });

    } catch (error: any) {
        
        if (!response.headersSent) {
            return response.status(500).json({ error: "Failed to send email. Check server logs for details." });
        }
    }
};

export const addOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const response :any=  createOrder(req.body.userId,req.body.productId,req.body.quantity,req?.body?.price);
    res.status(200).json({ message:'Order added successfully' });
  } catch (err) {
    next(err);
};
}

export const getProductsSoldTodayService = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const response :any=  getProductsSoldToday();
    res.status(200).json({ data:response });
  } catch (err) {
    next(err);
};
}

export const getProductsSoldThisWeekService =async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const response :any= await getProductsSoldThisWeek();
    res.status(200).json({ data:response });
  } catch (err) {
    next(err);
};
}

export const getRevenueThisMonthService = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const response :any= await  getRevenueThisMonth();
    res.status(200).json({ data:response });
  } catch (err) {
    next(err);
};
};

export const getWeeklySalesDataService = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const response :any= await getWeeklySalesData();
    res.status(200).json({ data:response });
  } catch (err) {
    next(err);
};
};

export const getSalesByCategoryService = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const response :any= await getSalesByCategory();
    res.status(200).json({ data:response });
  } catch (err) {
    next(err);
};
};