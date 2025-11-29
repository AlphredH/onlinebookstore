# Online Bookstore

A simple and beautiful online bookstore built with React. Browse books, search by title or author, and manage your shopping cart.

## Features

- **Browse Books**: View collection of books with titles, authors, genres, and prices
- **Search**: Find books by title or author
- **Shopping Cart**: Add books to cart, adjust quantities, and remove items

## Setup

1. **Clone the Repository**
   ```
   git clone <repository-url>
   cd CSCI426_Project_Phase1
   ```

2. **Install Dependencies**
   ```
   npm install
   ```

3. **Start the Application**
   ```
   npm start
   ```

4. **Open in Browser**
   - The app will automatically open at `http://localhost:3000`
   - If it doesn't open automatically, navigate to `http://localhost:3000` in your browser

## Project Screenshots (UI)

### Home Page
![Home Page](screenshots/home.png)


## Project Structure

```
src/
├── components/
│   ├── Home.js           # Home/Landing page
│   ├── BookList.js       # Browse books page
│   ├── BookDetails.js    # Dynamic book details page
│   ├── About.js          # About page
│   ├── Contact.js        # Contact page with form
│   ├── Cart.js           # Shopping cart page
│   └── Navbar.js         # Navigation bar
├── css/
│   ├── Home.css          # Home page styling
│   ├── BookList.css      # Book list styling
│   ├── BookDetails.css   # Book details styling
│   ├── About.css         # About page styling
│   ├── Contact.css       # Contact page styling
│   ├── Cart.css          # Cart styling
│   └── Navbar.css        # Navbar styling
├── App.js                # Main app with routing
├── App.css               # App styling
├── index.js              # Entry point
└── index.css             # Global styles
```

## How It Works

### Adding Books to Cart
- Click "Add to Cart" button on any book
- Book is added with quantity 1
- If book already in cart, quantity increases

### Managing Cart
- View all cart items in cart page
- Use +/- buttons to change quantity
- Click "Remove" to delete item from cart
- See total price automatically calculated

### Search Books
- Type in search bar on main page
- Filters books by title or author
- Results update instantly

## Technologies Used

- React 19
- React Router for navigation
- Material-UI Icons
- CSS for styling
- useState for state management

