import Database from "better-sqlite3";

// Initialize SQLite DB
const db = new Database("data.db");

// Create user table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )
`).run();


// Create products table
db.prepare(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image TEXT,
      title TEXT,
      price REAL,
      about TEXT,
      cloth TEXT,
      category TEXT,
      bought_by TEXT,
      saree_type TEXT
    )
  `).run();
  

  // Create liked_products table
db.prepare(`
    CREATE TABLE IF NOT EXISTS liked_products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      productId INTEGER NOT NULL,
      UNIQUE(userId, productId)
    )
  `).run();
  
  // Create cart_products table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS cart_products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      productId INTEGER NOT NULL,
      quantity INTEGER DEFAULT 1,
      UNIQUE(userId, productId)
    )
  `).run();
  

// Create a new user
export const createUser = (email: string, password: string) => {
  const stmt = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)");
  stmt.run(email, password);
};

// Get user by email
export const getUserByEmail = (email: string) => {
  const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
  return stmt.get(email);
};

// Add product
export const addProduct = (
    image: string,
    title: string,
    price: number,
    about: string,
    cloth: string,
    category: string,
    bought_by: string,
    saree_type: string
  ): void => {
    const stmt = db.prepare(`
      INSERT INTO products (image, title, price, about, cloth, category, bought_by, saree_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(image, title, price, about, cloth, category, bought_by, saree_type);
  };
  
  // Get all products
  export const getAllProducts = (): any[] => {
    const stmt = db.prepare("SELECT * FROM products");
    return stmt.all();
  };
  
  // Like a product
export const likeProduct = (userId: number, productId: number): void => {
    const stmt = db.prepare(`INSERT OR IGNORE INTO liked_products (userId, productId) VALUES (?, ?)`);
    stmt.run(userId, productId);
  };
  
  // Get liked products for a user
  export const getLikedProductsByUser = (userId: number): any[] => {
    const stmt = db.prepare(`
      SELECT p.* FROM products p
      JOIN liked_products l ON p.id = l.productId
      WHERE l.userId = ?
    `);
    return stmt.all(userId);
  };
  
  // Add product to cart
  export const addToCart = (userId: number, productId: number, quantity: number): void => {
    const stmt = db.prepare(`
      INSERT INTO cart_products (userId, productId, quantity)
      VALUES (?, ?, ?)
      ON CONFLICT(userId, productId) DO UPDATE SET quantity = quantity + excluded.quantity
    `);
    stmt.run(userId, productId, quantity);
  };
  
  // Get cart items for a user
  export const getCartByUser = (userId: number): any[] => {
    const stmt = db.prepare(`
      SELECT p.*, c.quantity FROM products p
      JOIN cart_products c ON p.id = c.productId
      WHERE c.userId = ?
    `);
    return stmt.all(userId);
  };
  
  export const getUserIdByEmail = (email: string): number | null => {
    const stmt = db.prepare("SELECT id FROM users WHERE email = ?");
    const user :any= stmt.get(email);
    return user ? user.userId : null;
  };
  