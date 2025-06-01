import Database from "better-sqlite3";

// Initialize SQLite DB
const db = new Database("data.db");

// Create user table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT,
    userName TeXT
  )
`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  productId INTEGER NOT NULL,
  quantity INTEGER DEFAULT 1,
  price REAL NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(userId) REFERENCES users(id),
  FOREIGN KEY(productId) REFERENCES products(id)
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
    saree_type TEXT,
    created_at TEXT,
    created_by TEXT,
    modified_by TEXT,
    modified_at TEXT,
    is_active INTEGER DEFAULT 1
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
    )`).run();
  

// Create a new user
export const createUser = (email: string, hashedPassword: string, role: string,userName:string) => {
  const stmt = db.prepare("INSERT INTO users (email, password, role,userName) VALUES (?, ?, ?,?)");
  stmt.run(email, hashedPassword, role,userName);
};



export const getUserByEmail = (email: string) => {
  const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
  return stmt.get(email); // Returns single user object
};

export const getUserList = (): any[] => {
  const stmt = db.prepare("SELECT * FROM users");
  return stmt.all();
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
  saree_type: string,
  created_by: string
): void => {
  const created_at = new Date().toISOString(); // current timestamp
  const is_active = 1; // product is active by default

  const stmt = db.prepare(`
    INSERT INTO products (
      image,
      title,
      price,
      about,
      cloth,
      category,
      bought_by,
      saree_type,
      created_at,
      created_by,
      is_active
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    image,
    title,
    price,
    about,
    cloth,
    category,
    bought_by,
    saree_type,
    created_at,
    created_by,
    is_active
  );
};

  
  // Get all products
  export const getAllProducts = (): any[] => {
    const stmt = db.prepare("SELECT * FROM products");
    return stmt.all();
  };
  
  // Like a product
export const likeProduct = (userId: number, productId: number): void => {
  const exists = db.prepare(`SELECT 1 FROM liked_products WHERE userId = ? AND productId = ?`).get(userId, productId);

  if (!exists) {
    const stmt = db.prepare(`INSERT INTO liked_products (userId, productId) VALUES (?, ?)`);
    stmt.run(userId, productId);
  } else {
    console.log(`User ${userId} already liked product ${productId}`);
  }
};

export const updateProductStatus = (
  productId: number,
  isActive: boolean,
  modifiedBy: string
): void => {
  const modified_at = new Date().toISOString(); 
  const stmt = db.prepare(`
    UPDATE products
    SET is_active = ?,
        modified_by = ?,
        modified_at = ?
    WHERE id = ?
  `);

  stmt.run(isActive ? 1 : 0, modifiedBy, modified_at, productId);
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
    
    return user ? user.id : null;
  };
  export const createOrder = (
  userId: number,
  productId: number,
  quantity: number,
  price: number
): void => {
  const stmt = db.prepare(`
    INSERT INTO orders (userId, productId, quantity, price)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(userId, productId, quantity, price);
};


export const getProductsSoldToday = (): number => {
  const stmt = db.prepare(`
    SELECT SUM(quantity) as total FROM orders 
    WHERE DATE(createdAt) = DATE('now')
  `);
  const result = stmt.get() as { total: number | null };
  return result.total ?? 0;
};

export const getProductsSoldThisWeek = (): number => {
  const stmt = db.prepare(`
    SELECT SUM(quantity) as total FROM orders 
    WHERE strftime('%W', createdAt) = strftime('%W', 'now')
  `);
  const result = stmt.get() as { total: number | null };
  return result.total ?? 0;
};


export const getRevenueThisMonth = (): number => {
  const stmt = db.prepare(`
    SELECT SUM(quantity * price) as total FROM orders 
    WHERE strftime('%m', createdAt) = strftime('%m', 'now')
  `);
  const result = stmt.get() as { total: number | null };
  return result.total ?? 0;
};

export const getWeeklySalesData = (): { name: string; sales: number }[] => {
  const stmt = db.prepare(`
    SELECT strftime('%w', createdAt) as weekday, SUM(quantity) as sales
    FROM orders
    WHERE strftime('%W', createdAt) = strftime('%W', 'now')
    GROUP BY weekday
  `);
  const raw = stmt.all() as { weekday: string; sales: number }[];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return weekdays.map((day, index) => {
    const entry = raw.find((r) => Number(r.weekday) === index);
    return { name: day, sales: entry?.sales ?? 0 };
  });
};

export const getSalesByCategory = (): { name: string; value: number }[] => {
  const stmt = db.prepare(`
    SELECT p.category, SUM(o.quantity) as value
    FROM orders o
    JOIN products p ON o.productId = p.id
    GROUP BY p.category
  `);
  const rows = stmt.all() as { category: string; value: number }[];
  return rows.map(row => ({ name: row.category, value: row.value }));
};

export const editProduct = (
  id: number,
  image: string,
  title: string,
  price: number,
  about: string,
  cloth: string,
  category: string,
  bought_by: string,
  saree_type: string,
  modified_by: string
): void => {
  const modified_at = new Date().toISOString();

  const stmt = db.prepare(`
    UPDATE products
    SET
      image = ?,
      title = ?,
      price = ?,
      about = ?,
      cloth = ?,
      category = ?,
      bought_by = ?,
      saree_type = ?,
      modified_by = ?,
      modified_at = ?
    WHERE id = ?
  `);

  stmt.run(
    image,
    title,
    price,
    about,
    cloth,
    category,
    bought_by,
    saree_type,
    modified_by,
    modified_at,
    id
  );
};

export const searchProducts = (keyword: string): any[] => {
  const searchTerm = `%${keyword}%`;

  const stmt = db.prepare(`
    SELECT * FROM products
    WHERE
      title LIKE ? OR
      category LIKE ? OR
      saree_type LIKE ?
    AND is_active = 1
  `);

  return stmt.all(searchTerm, searchTerm, searchTerm);
};
export const getPaginatedProducts = (page: number, pageSize: number = 10): { products: any[], total: number } => {
  const offset = (page - 1) * pageSize;

  // Get total count of active products
  const countStmt = db.prepare(`SELECT COUNT(*) as total FROM products WHERE is_active = 1`);
  const countResult = countStmt.get() as { total: number };
  const total = countResult.total;

  // Get paginated products
  const stmt = db.prepare(`
    SELECT * FROM products
    WHERE is_active = 1
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `);
  const products = stmt.all(pageSize, offset);


  return {
    products,
    total
  };
};

