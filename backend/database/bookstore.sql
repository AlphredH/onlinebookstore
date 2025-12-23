/*
 Navicat Premium Dump SQL

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 100432 (10.4.32-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : bookstore

 Target Server Type    : MySQL
 Target Server Version : 100432 (10.4.32-MariaDB)
 File Encoding         : 65001

 Date: 23/12/2025 04:45:33
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for books
-- ----------------------------
DROP TABLE IF EXISTS `books`;
CREATE TABLE `books`  (
  `book_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `author` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `genre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `price` decimal(10, 2) NOT NULL,
  `stock_quantity` int NULL DEFAULT 0,
  `pages` int NULL DEFAULT NULL,
  `year` int NULL DEFAULT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`book_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of books
-- ----------------------------
INSERT INTO `books` VALUES (1, 'The Great Gatsby', 'F. Scott Fitzgerald', 'Classic', 'A classic American novel set in the Jazz Age', 12.99, 50, 180, 1925, NULL, '2025-12-23 01:25:21', '2025-12-23 01:25:21');
INSERT INTO `books` VALUES (2, 'To Kill a Mockingbird', 'Harper Lee', 'Classic', 'A gripping tale of racial injustice and childhood innocence', 14.99, 45, 324, 1960, NULL, '2025-12-23 01:25:21', '2025-12-23 01:25:21');
INSERT INTO `books` VALUES (3, '1984', 'George Orwell', 'Dystopian', 'A dystopian social science fiction novel', 13.99, 60, 328, 1949, NULL, '2025-12-23 01:25:21', '2025-12-23 01:25:21');
INSERT INTO `books` VALUES (4, 'Pride and Prejudice', 'Jane Austen', 'Romance', 'A romantic novel of manners', 11.99, 40, 432, 1813, NULL, '2025-12-23 01:25:21', '2025-12-23 01:25:21');
INSERT INTO `books` VALUES (5, 'The Catcher in the Rye', 'J.D. Salinger', 'Classic', 'A story about teenage rebellion and alienation', 12.99, 35, 234, 1951, NULL, '2025-12-23 01:25:21', '2025-12-23 01:25:21');
INSERT INTO `books` VALUES (6, 'Harry Potter and the Philosopher Stone', 'J.K. Rowling', 'Fantasy', 'A young wizard begins his magical journey', 19.99, 100, 309, 1997, NULL, '2025-12-23 01:25:21', '2025-12-23 01:25:21');
INSERT INTO `books` VALUES (7, 'The Hobbit', 'J.R.R. Tolkien', 'Fantasy', 'A fantasy adventure novel', 15.99, 55, 310, 1937, NULL, '2025-12-23 01:25:21', '2025-12-23 01:25:21');
INSERT INTO `books` VALUES (8, 'Fahrenheit 451', 'Ray Bradbury', 'Science Fiction', 'A dystopian novel about book burning', 13.99, 42, 249, 1953, NULL, '2025-12-23 01:25:21', '2025-12-23 01:25:21');
INSERT INTO `books` VALUES (9, 'Book1', 'Auth1', 'Genre1', 'Description1', 150.00, 50, 250, 2025, 'https://images.template.net/453953/6x9-Book-Cover-Template-edit-online.png', '2025-12-23 04:17:39', '2025-12-23 04:17:39');

-- ----------------------------
-- Table structure for order_items
-- ----------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items`  (
  `order_item_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `book_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10, 2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (`order_item_id`) USING BTREE,
  INDEX `order_id`(`order_id` ASC) USING BTREE,
  INDEX `book_id`(`book_id` ASC) USING BTREE,
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of order_items
-- ----------------------------

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders`  (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total_amount` decimal(10, 2) NOT NULL,
  `status` enum('pending','processing','completed','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'pending',
  `shipping_address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of orders
-- ----------------------------

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `full_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `is_admin` tinyint(1) NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE,
  UNIQUE INDEX `email`(`email` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'admin', 'admin@bookstore.com', '$2a$10$1jqrxSMQtQlV4ypKkAfowulxTzIaE3ytVLlrkFO4JNwz71kSbh.JC', 'Admin User', '123 Admin Street', '1234567890', 1, '2025-12-23 01:25:21', '2025-12-23 01:29:52');

SET FOREIGN_KEY_CHECKS = 1;
