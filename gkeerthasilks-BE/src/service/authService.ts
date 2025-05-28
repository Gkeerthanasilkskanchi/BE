import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { createUser, getUserByEmail, getUserList } from "../repository/contactRepo";
import { log } from "console";

// Register a new user
export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser(email, hashedPassword,'admin');
 
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
};

// Login a user (validate the password)
export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { email, password } = req.body;

  try {
    // Fetch user from the database
    const user :any= await getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful",role:user.role });
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

  try {
    // Check if the user already exists
    const existingUser = await getUserList();
    
    res.status(201).json({ data:existingUser});
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
};