# Online Bookstore - Project Report (Phase 1 & 2)

---

## Title Page

**Project Title:** Online Bookstore - Full Stack Application

**Course:** CSCI426 - Project Phase 1 & Phase 2

**Student Name:** Alphred Hajj and Richard Tanios

**Student ID:** 62110101 and 62130314

**Date:** December 21, 2024

---

## Abstract

This project presents a comprehensive full-stack online bookstore web application featuring a React frontend and Node.js/Express backend with MySQL database. The application provides complete e-commerce functionality including user authentication, book catalog browsing, shopping cart management, and order processing. Users can register accounts, login securely, browse an extensive book collection, search by various criteria, add books to their cart, and complete purchases with order tracking. The backend implements RESTful API architecture with JWT-based authentication, secure password hashing, and transactional order processing. The frontend utilizes React Router for seamless navigation, Context API for authentication state management, and Axios for API communication. The system demonstrates modern web development practices including component-based architecture, responsive design, secure authentication, database normalization, and API-driven architecture.

---

## System Design

### Architecture Overview

The application implements a three-tier architecture:

1. **Presentation Layer (React Frontend):**
   - Component-based UI with React 19
   - Client-side routing with React Router
   - State management with React Context API and hooks
   - Axios for HTTP requests to backend

2. **Application Layer (Express.js Backend):**
   - RESTful API endpoints
   - JWT authentication middleware
   - Business logic for orders, users, and books
   - CORS configuration for cross-origin requests

3. **Data Layer (MySQL Database):**
   - Relational database with normalized schema
   - Four main tables: users, books, orders, order_items
   - Foreign key relationships for data integrity
   - Transaction support for order processing

### System Components

**Frontend Components:**
- **App Component:** Main application container with routing and authentication context
- **Navbar Component:** Navigation bar with authentication status display
- **Home Component:** Landing page with featured sections
- **BookList Component:** Book catalog with search functionality
- **BookDetails Component:** Detailed book information page
- **Cart Component:** Shopping cart with checkout functionality
- **Login/Register Components:** User authentication forms
- **Orders Component:** User order history display
- **Admin Component:** Admin panel for book management (add, edit, delete)
- **About Component:** Information about the bookstore
- **Contact Component:** Contact form

**Backend Components:**
- **Server (server.js):** Express application with middleware configuration
- **Authentication Middleware:** Token validation and admin role verification
- **Authentication Routes:** Register, login, profile management
- **Books Routes:** CRUD operations for book catalog (admin-protected for modifications)
- **Orders Routes:** Order creation and retrieval
- **Database Connection:** MySQL connection management

**Authentication Context:**
- Centralized authentication state management
- Login/logout functionality
- Token storage in localStorage
- Protected route handling

**API Service:**
- Axios instance with base URL configuration
- Request interceptor for JWT token injection
- Organized API methods by resource (auth, books, orders)

### Database Schema

**Users Table:**
```sql
user_id (PK)
username (UNIQUE)
email (UNIQUE)
password (HASHED)
full_name
address
phone
is_admin (BOOLEAN, DEFAULT FALSE)
created_at
updated_at
```

**Books Table:**
```sql
book_id (PK)
title
author
genre
description
price
stock_quantity
pages
year
image_url
created_at
updated_at
```

**Orders Table:**
```sql
order_id (PK)
user_id (FK → users)
total_amount
status (ENUM: pending, processing, completed, cancelled)
shipping_address
created_at
updated_at
```

**Order Items Table:**
```sql
order_item_id (PK)
order_id (FK → orders)
book_id (FK → books)
quantity
price
created_at
```

### Data Flow

**Authentication Flow:**
1. User submits login/register form
2. Frontend sends credentials to backend API
3. Backend validates and generates JWT token
4. Token stored in localStorage
5. Token included in subsequent API requests
6. Backend middleware validates token for protected routes

**Shopping Flow:**
1. User browses books (public access)
2. Books fetched from MySQL database via API
3. User adds books to cart (client-side state)
4. At checkout, user must authenticate
5. Order submitted to backend with cart items
6. Backend validates stock and creates order transaction
7. Stock quantities updated atomically
8. Order confirmation returned to frontend
9. Cart cleared and user redirected to orders page

**Order Processing:**
1. Frontend sends order with items array and shipping address
2. Backend starts database transaction
3. Validates each book exists and has sufficient stock
4. Calculates total amount
5. Creates order record
6. Creates order_items records
7. Decrements stock quantities
8. Commits transaction or rolls back on error
9. Returns order confirmation

### Key Features

**User Authentication:**
- Secure registration with password hashing (bcrypt)
- JWT-based stateless authentication
- Role-based access control (user/admin)
- Protected routes requiring authentication
- Profile management

**Admin Panel:**
- Restricted access for admin users only
- Add new books to catalog
- Edit existing book information
- Delete books from inventory
- View all books in table format
- Real-time inventory management

**Book Management:**
- Browse complete catalog
- Search by title, author, or genre
- View detailed book information
- Real-time stock availability

**Shopping Cart:**
- Add/remove books
- Quantity management
- Automatic price calculation
- Persistent across page navigation

**Order Processing:**
- Checkout with shipping address
- Transaction-based order creation
- Inventory management
- Order history viewing

**Security:**
- Password hashing with bcrypt
- JWT token authentication
- Role-based access control for admin features
- SQL injection prevention with parameterized queries
- CORS configuration

---

## Technologies Used

### Frontend Technologies

**React 19.1.1**
- Component-based architecture
- Hooks for state management (useState, useEffect, useContext)
- Virtual DOM for efficient rendering
- JSX syntax for component templates

**React Router DOM 7.9.1**
- Client-side routing
- Dynamic route parameters
- Navigation components (Link, useNavigate, useParams)
- Protected route patterns

**Material-UI Icons 7.3.2**
- Pre-built icon components
- Consistent design system
- MenuBook, ShoppingCart icons

**Axios 1.6.0**
- Promise-based HTTP client
- Request/response interceptors
- Automatic JSON transformation
- Error handling

**CSS3**
- Custom stylesheets per component
- Gradient backgrounds
- Flexbox and Grid layouts
- Responsive design
- Animations and transitions

### Backend Technologies

**Node.js with Express.js 4.18.2**
- Fast, minimalist web framework
- Middleware support
- RESTful API routing
- JSON parsing

**MySQL2 3.6.5**
- MySQL client for Node.js
- Promise-based API
- Connection pooling
- Prepared statements

**JSON Web Tokens (jsonwebtoken 9.0.2)**
- Stateless authentication
- Token generation and verification
- Configurable expiration
- Secure payload encryption

**bcryptjs 2.4.3**
- Password hashing algorithm
- Salt generation
- Secure comparison
- 10 rounds of hashing

**CORS 2.8.5**
- Cross-Origin Resource Sharing
- Configurable origin whitelist
- Preflight request handling

**dotenv 16.3.1**
- Environment variable management
- Configuration separation
- Secure credential storage



---

## Code Snippets

### 1. Express Backend Server with Authentication Middleware

```javascript
// Backend server setup with authentication
const app = express();
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (users.length === 0) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  const isValid = await bcrypt.compare(password, users[0].password);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  const token = jwt.sign(
    { user_id: users[0].user_id, email: users[0].email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  res.json({ token, user: users[0] });
});
```

**Key Points:**
- Express middleware for request processing
- MySQL connection pooling for efficiency
- JWT authentication middleware protecting routes
- Password verification with bcrypt
- Token generation with configurable expiration

---

### 2. Frontend Authentication Context

```javascript
// AuthContext.js - Centralized authentication state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  
  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message 
      };
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**Key Points:**
- React Context API for global authentication state
- localStorage for token persistence
- Custom hook for accessing auth state
- Error handling for login failures

---

### 3. API Service with Axios Interceptors

```javascript
// api.js - Centralized API communication
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Books API
export const booksAPI = {
  getAll: () => api.get('/books'),
  getById: (id) => api.get(`/books/${id}`),
  search: (query) => api.get(`/books/search/${query}`),
  create: (bookData) => api.post('/books', bookData),
  update: (id, bookData) => api.put(`/books/${id}`, bookData),
  delete: (id) => api.delete(`/books/${id}`)
};

// Orders API
export const ordersAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`)
};
```

**Key Points:**
- Axios instance with base URL configuration
- Request interceptor for automatic token injection
- Organized API methods by resource
- Promise-based async operations

---

### 4. Order Processing with Database Transactions

```javascript
// Create order endpoint with transaction
app.post('/api/orders', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { items, shipping_address } = req.body;
    let total_amount = 0;
    
    // Validate stock and calculate total
    for (const item of items) {
      const [books] = await connection.query(
        'SELECT price, stock_quantity FROM books WHERE book_id = ?',
        [item.book_id]
      );
      
      if (books.length === 0) {
        await connection.rollback();
        return res.status(404).json({ message: `Book ${item.book_id} not found` });
      }
      
      if (books[0].stock_quantity < item.quantity) {
        await connection.rollback();
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      
      total_amount += books[0].price * item.quantity;
    }
    
    // Create order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_amount, shipping_address) VALUES (?, ?, ?)',
      [req.user.user_id, total_amount, shipping_address]
    );
    
    // Create order items and update stock
    for (const item of items) {
      const [books] = await connection.query(
        'SELECT price FROM books WHERE book_id = ?',
        [item.book_id]
      );
      
      await connection.query(
        'INSERT INTO order_items (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderResult.insertId, item.book_id, item.quantity, books[0].price]
      );
      
      await connection.query(
        'UPDATE books SET stock_quantity = stock_quantity - ? WHERE book_id = ?',
        [item.quantity, item.book_id]
      );
    }
    
    await connection.commit();
    res.status(201).json({ 
      message: 'Order created',
      order_id: orderResult.insertId,
      total_amount
    });
    
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Order creation failed' });
  } finally {
    connection.release();
  }
});
```

**Key Points:**
- Database transactions for atomic operations
- Stock validation before order creation
- Rollback on any error
- Inventory management with stock updates
- Multiple table coordination

---

### 5. Cart Component with Checkout Integration

```javascript
function Cart({ cart, onRemove, onUpdateQuantity, onClearCart }) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShippingAddress(user.address || '');
    setShowCheckout(true);
  };
  
  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        items: cart.map(item => ({
          book_id: item.id,
          quantity: item.quantity
        })),
        shipping_address: shippingAddress
      };
      
      await ordersAPI.create(orderData);
      onClearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message);
    }
  };
  
  return (
    <div className="cart-container">
      {/* Cart items display */}
      
      <div className="cart-summary">
        {!showCheckout ? (
          <button onClick={handleCheckoutClick}>
            Proceed to Checkout
          </button>
        ) : (
          <div className="checkout-form">
            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Enter shipping address"
            />
            <button onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Key Points:**
- Authentication check before checkout
- Dynamic form display based on state
- Integration with orders API
- Cart clearing after successful order
- Navigation to order history

---

### 6. Database Schema SQL

```sql
-- Users table with authentication
CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books table with inventory
CREATE TABLE books (
  book_id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  author VARCHAR(100) NOT NULL,
  genre VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INT DEFAULT 0,
  pages INT,
  year INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table with status tracking
CREATE TABLE orders (
  order_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
  shipping_address TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Order items for many-to-many relationship
CREATE TABLE order_items (
  order_item_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  book_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
);
```

**Key Points:**
- Normalized database design
- Foreign key relationships for referential integrity
- ENUM type for order status
- Timestamps for audit trail
- CASCADE delete for data consistency

---

## Conclusion

This full-stack online bookstore application demonstrates comprehensive web development skills including frontend design with React, backend API development with Express.js, database design with MySQL, and secure authentication with JWT. The project successfully implements a complete e-commerce workflow from browsing to order completion, with proper error handling, security measures, and user-friendly interfaces. The modular architecture allows for easy maintenance and future enhancements such as payment processing, admin dashboards, and advanced search features.

---

## Future Enhancements

1. **Payment Integration:** Add payment gateway (Stripe, PayPal)
2. **Admin Dashboard:** Book inventory management and order processing
3. **Reviews & Ratings:** User feedback system for books
4. **Wishlist:** Save books for later purchase
5. **Advanced Search:** Filters by price, genre, publication year
6. **Password Reset:** Email-based password recovery
7. **Order Tracking:** Real-time order status updates
8. **Recommendations:** AI-based book suggestions
9. **Mobile App:** React Native version
10. **Analytics:** Sales and user behavior tracking

---

  return (
    <div className="cart-container">
      <table className="cart-table">
        <thead>
          <tr>
            <th>Book</th>
            <th>Author</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cart.map(item => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.author}</td>
              <td>${item.price}</td>
              <td>
                <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
              </td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
              <td>
                <button onClick={() => onRemove(item.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="cart-summary">
        <h2>Total Price: ${totalPrice.toFixed(2)}</h2>
      </div>
    </div>
  );
}
```

**Key Points:**
- Calculate total using reduce function
- Quantity management with +/- buttons
- Remove items functionality
- Dynamic subtotal calculation

---

### 4. Dynamic Book Details Route

```javascript
function BookDetails({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const allBooks = [
    { 
      id: 1, 
      title: 'To Kill a Mockingbird', 
      author: 'Harper Lee', 
      price: 12.99, 
      genre: 'Fiction',
      description: 'A gripping tale of racial injustice...',
      year: 1960,
      pages: 324
    },
    // ...
  ];

  const book = allBooks.find(b => b.id === parseInt(id));

  if (!book) {
    return <div>Book Not Found</div>;
  }

  return (
    <div className="book-details-card">
      <button onClick={() => navigate('/books')}>Back to Books</button>
      <h1>{book.title}</h1>
      <p>{book.author}</p>
      <div className="book-meta">
        <span className="genre">{book.genre}</span>
        <span className="year">{book.year}</span>
        <span className="pages">{book.pages} pages</span>
      </div>
      <p>{book.description}</p>
      <button onClick={() => onAddToCart(book)}>Add to Cart</button>
    </div>
  );
}
```

**Key Points:**
- UseParams hook to extract route parameter
- Find specific book by ID
- Navigate back functionality
- Error handling for missing books

---

### 5. Contact Form with State Management

```javascript
function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {submitted && <div className="success-message">Message sent successfully!</div>}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        required
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your message"
        required
      />
      <button type="submit">Send Message</button>
    </form>
  );
}
```

**Key Points:**
- Controlled form components
- Form validation
- Success feedback with auto-hide
- Reset form after submission

---

## Conclusion

This online bookstore application successfully demonstrates modern web development practices using React. The project implements all required features including multiple pages, dynamic routing, state management, and a functional shopping cart system. The clean, user-friendly interface combined with efficient code structure makes this a solid foundation for a full-featured e-commerce platform.

---

**End of Report**
