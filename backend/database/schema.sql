-- Create Database
CREATE DATABASE IF NOT EXISTS bookstore;
USE bookstore;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Books Table
CREATE TABLE IF NOT EXISTS books (
    book_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL,
    genre VARCHAR(50) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    pages INT,
    year INT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    book_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
);

-- Insert Sample Books
INSERT INTO books (title, author, genre, description, price, stock_quantity, pages, year) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 'Classic', 'A classic American novel set in the Jazz Age', 12.99, 50, 180, 1925),
('To Kill a Mockingbird', 'Harper Lee', 'Classic', 'A gripping tale of racial injustice and childhood innocence', 14.99, 45, 324, 1960),
('1984', 'George Orwell', 'Dystopian', 'A dystopian social science fiction novel', 13.99, 60, 328, 1949),
('Pride and Prejudice', 'Jane Austen', 'Romance', 'A romantic novel of manners', 11.99, 40, 432, 1813),
('The Catcher in the Rye', 'J.D. Salinger', 'Classic', 'A story about teenage rebellion and alienation', 12.99, 35, 234, 1951),
('Harry Potter and the Philosopher Stone', 'J.K. Rowling', 'Fantasy', 'A young wizard begins his magical journey', 19.99, 100, 309, 1997),
('The Hobbit', 'J.R.R. Tolkien', 'Fantasy', 'A fantasy adventure novel', 15.99, 55, 310, 1937),
('Fahrenheit 451', 'Ray Bradbury', 'Science Fiction', 'A dystopian novel about book burning', 13.99, 42, 249, 1953);

-- Insert Sample Admin User (username: admin, password: admin123)
-- Note: Replace this hashed password with a real bcrypt hash before production
INSERT INTO users (username, email, password, full_name, address, phone, is_admin) VALUES
('admin', 'admin@bookstore.com', '$2a$10$rJVY8K8z8K8z8K8z8K8z8.K8z8K8z8K8z8K8z8K8z8K8z8K8z8K8z', 'Admin User', '123 Admin Street', '1234567890', TRUE);
