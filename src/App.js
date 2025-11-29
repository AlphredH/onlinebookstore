import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import BookList from './components/BookList';
import BookDetails from './components/BookDetails';
import About from './components/About';
import Contact from './components/Contact';
import Cart from './components/Cart';

function App() {
  const [cart, setCart] = useState([]);

  const handleAddToCart = (book) => {
    const existingBook = cart.find(item => item.id === book.id);
    if (existingBook) {
      setCart(cart.map(item =>
        item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...book, quantity: 1 }]);
    }
  };

  const handleRemove = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      handleRemove(id);
    } else {
      setCart(cart.map(item =>
        item.id === id ? { ...item, quantity: quantity } : item
      ));
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar cartCount={cart.length} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BookList onAddToCart={handleAddToCart} />} />
          <Route path="/book/:id" element={<BookDetails onAddToCart={handleAddToCart} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={
            <Cart 
              cart={cart} 
              onRemove={handleRemove}
              onUpdateQuantity={handleUpdateQuantity}
            />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
