import express from "express";
import mysql from "mysql";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create MYSQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bookstore",
});

// Test database connection
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to MySQL database successfully!");
  }
});

const JWT_SECRET = "myBookstoreSecretKey123!@#";

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    if (!user.is_admin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    req.user = user;
    next();
  });
};

// =====================
// AUTH ROUTES
// =====================

// Register new user
app.post('/api/auth/register', (req, res) => {
  const { username, email, password, full_name, address, phone } = req.body;

  // Validate required fields
  if (!username || !email || !password || !full_name) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  // Check if user already exists
  const checkQuery = 'SELECT * FROM users WHERE email = ? OR username = ?';
  db.query(checkQuery, [email, username], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Server error during registration' });
    }

    if (data.length > 0) {
      return res.status(400).json({ message: 'User with this email or username already exists' });
    }

    // Hash password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: 'Error hashing password' });
      }

      // Insert new user
      const insertQuery = 'INSERT INTO users (username, email, password, full_name, address, phone) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(insertQuery, [username, email, hashedPassword, full_name, address || null, phone || null], (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: 'Server error during registration' });
        }

        // Generate token
        const token = jwt.sign(
          { user_id: result.insertId, username, email, is_admin: false },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.status(201).json({
          message: 'User registered successfully',
          token,
          user: { user_id: result.insertId, username, email, full_name, is_admin: false }
        });
      });
    });
  });
});

// Login user
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  // Find user
  const q = 'SELECT * FROM users WHERE email = ?';
  db.query(q, [email], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Server error during login' });
    }

    if (data.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = data[0];

    // Check password
    bcrypt.compare(password, user.password, (err, isValid) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server error during login' });
      }

      if (!isValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Generate token
      const token = jwt.sign(
        { user_id: user.user_id, username: user.username, email: user.email, is_admin: user.is_admin },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          address: user.address,
          phone: user.phone,
          is_admin: user.is_admin
        }
      });
    });
  });
});

// Get current user profile
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  const q = 'SELECT user_id, username, email, full_name, address, phone, created_at FROM users WHERE user_id = ?';
  db.query(q, [req.user.user_id], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Server error fetching profile' });
    }

    if (data.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(data[0]);
  });
});

// Update user profile
app.put('/api/auth/profile', authenticateToken, (req, res) => {
  const { full_name, address, phone } = req.body;
  const q = 'UPDATE users SET full_name = ?, address = ?, phone = ? WHERE user_id = ?';
  
  db.query(q, [full_name, address, phone, req.user.user_id], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Server error updating profile' });
    }
    res.json({ message: 'Profile updated successfully' });
  });
});

// =====================
// BOOKS ROUTES
// =====================

// Get all books
app.get('/api/books', (req, res) => {
  const q = 'SELECT * FROM books ORDER BY created_at DESC';
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Server error fetching books' });
    }
    res.json(data);
  });
});

// Get single book by ID
app.get('/api/books/:id', (req, res) => {
  const q = 'SELECT * FROM books WHERE book_id = ?';
  db.query(q, [req.params.id], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Server error fetching book' });
    }

    if (data.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(data[0]);
  });
});

// Search books
app.get('/api/books/search/:query', (req, res) => {
  const searchQuery = `%${req.params.query}%`;
  const q = 'SELECT * FROM books WHERE title LIKE ? OR author LIKE ? OR genre LIKE ?';
  db.query(q, [searchQuery, searchQuery, searchQuery], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Server error searching books' });
    }
    res.json(data);
  });
});

// Add new book (admin only)
app.post('/api/books', authenticateAdmin, (req, res) => {
  const { title, author, genre, description, price, stock_quantity, pages, year, image_url } = req.body;

  if (!title || !author || !genre || !price) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  const q = 'INSERT INTO books (title, author, genre, description, price, stock_quantity, pages, year, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(q, [title, author, genre, description, price, stock_quantity || 0, pages, year, image_url], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Server error adding book' });
    }

    res.status(201).json({
      message: 'Book added successfully',
      book_id: data.insertId
    });
  });
});

// Update book
app.put('/api/books/:id', authenticateAdmin, (req, res) => {
  const { title, author, genre, description, price, stock_quantity, pages, year, image_url } = req.body;
  const q = 'UPDATE books SET title = ?, author = ?, genre = ?, description = ?, price = ?, stock_quantity = ?, pages = ?, year = ?, image_url = ? WHERE book_id = ?';
  
  db.query(q, [title, author, genre, description, price, stock_quantity, pages, year, image_url, req.params.id], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Server error updating book' });
    }

    if (data.affectedRows === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book updated successfully' });
  });
});

// Delete book
app.delete('/api/books/:id', authenticateAdmin, (req, res) => {
  const q = 'DELETE FROM books WHERE book_id = ?';
  db.query(q, [req.params.id], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Server error deleting book' });
    }

    if (data.affectedRows === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully' });
  });
});

// =====================
// ORDERS ROUTES
// =====================

// Create new order
app.post('/api/orders', authenticateToken, (req, res) => {
  const { items, shipping_address } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Order must contain at least one item' });
  }

  let total_amount = 0;
  let processedItems = 0;

  // Calculate total and validate stock
  items.forEach((item, index) => {
    const checkQuery = 'SELECT price, stock_quantity FROM books WHERE book_id = ?';
    db.query(checkQuery, [item.book_id], (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server error creating order' });
      }

      if (data.length === 0) {
        return res.status(404).json({ message: `Book with ID ${item.book_id} not found` });
      }

      if (data[0].stock_quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for book ID ${item.book_id}` });
      }

      total_amount += data[0].price * item.quantity;
      processedItems++;

      // Once all items are processed, create the order
      if (processedItems === items.length) {
        createOrder();
      }
    });
  });

  function createOrder() {
    // Insert order
    const orderQuery = 'INSERT INTO orders (user_id, total_amount, shipping_address) VALUES (?, ?, ?)';
    db.query(orderQuery, [req.user.user_id, total_amount, shipping_address], (err, orderResult) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server error creating order' });
      }

      const order_id = orderResult.insertId;
      let itemsInserted = 0;

      // Insert order items and update stock
      items.forEach((item) => {
        const getPriceQuery = 'SELECT price FROM books WHERE book_id = ?';
        db.query(getPriceQuery, [item.book_id], (err, bookData) => {
          if (err) {
            console.log(err);
            return;
          }

          const itemQuery = 'INSERT INTO order_items (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)';
          db.query(itemQuery, [order_id, item.book_id, item.quantity, bookData[0].price], (err) => {
            if (err) {
              console.log(err);
              return;
            }

            // Update stock
            const updateStockQuery = 'UPDATE books SET stock_quantity = stock_quantity - ? WHERE book_id = ?';
            db.query(updateStockQuery, [item.quantity, item.book_id], (err) => {
              if (err) {
                console.log(err);
                return;
              }

              itemsInserted++;
              if (itemsInserted === items.length) {
                res.status(201).json({
                  message: 'Order created successfully',
                  order_id,
                  total_amount
                });
              }
            });
          });
        });
      });
    });
  }
});

// Get user's orders
app.get('/api/orders', authenticateToken, (req, res) => {
  const q = 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC';
  db.query(q, [req.user.user_id], (err, orders) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Server error fetching orders' });
    }

    if (orders.length === 0) {
      return res.json([]);
    }

    let ordersProcessed = 0;
    orders.forEach((order) => {
      const itemsQuery = `SELECT oi.*, b.title, b.author, b.image_url 
                          FROM order_items oi 
                          JOIN books b ON oi.book_id = b.book_id 
                          WHERE oi.order_id = ?`;
      db.query(itemsQuery, [order.order_id], (err, items) => {
        if (err) {
          console.log(err);
        } else {
          order.items = items;
        }
        ordersProcessed++;
        if (ordersProcessed === orders.length) {
          res.json(orders);
        }
      });
    });
  });
});

// Get single order by ID
app.get('/api/orders/:id', authenticateToken, (req, res) => {
  const q = 'SELECT * FROM orders WHERE order_id = ? AND user_id = ?';
  db.query(q, [req.params.id, req.user.user_id], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Server error fetching order' });
    }

    if (data.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = data[0];
    const itemsQuery = `SELECT oi.*, b.title, b.author, b.image_url 
                        FROM order_items oi 
                        JOIN books b ON oi.book_id = b.book_id 
                        WHERE oi.order_id = ?`;
    db.query(itemsQuery, [order.order_id], (err, items) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server error fetching order' });
      }
      order.items = items;
      res.json(order);
    });
  });
});

// Update order status (admin only - simplified)
app.put('/api/orders/:id/status', authenticateToken, (req, res) => {
  const { status } = req.body;

  const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const q = 'UPDATE orders SET status = ? WHERE order_id = ?';
  db.query(q, [status, req.params.id], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Server error updating order status' });
    }

    if (data.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully' });
  });
});

// =====================
// SERVER
// =====================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
