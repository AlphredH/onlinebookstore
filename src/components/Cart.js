import '../css/Cart.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';

function Cart({ cart, onRemove, onUpdateQuantity, onClearCart }) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShippingAddress(user.address || '');
    setShowCheckout(true);
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress.trim()) {
      setError('Please enter a shipping address');
      return;
    }

    setLoading(true);
    setError('');

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
      setShowCheckout(false);
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <p>{cart.length} {cart.length === 1 ? 'item' : 'items'} in cart</p>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <a href="/books" className="continue-shopping">Continue Shopping</a>
        </div>
      ) : (
        <>
          <div className="cart-items">
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
                    <td className="book-title">{item.title}</td>
                    <td>{item.author}</td>
                    <td className="price">${item.price}</td>
                    <td>
                      <div className="quantity-controls">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="qty-btn"
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="qty-btn"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="subtotal">${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button 
                        onClick={() => onRemove(item.id)} 
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Total Items:</span>
                <span>{cart.reduce((total, item) => total + item.quantity, 0)}</span>
              </div>
              <div className="summary-row total">
                <span>Total Price:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              
              {!showCheckout ? (
                <button className="checkout-btn" onClick={handleCheckoutClick}>
                  Proceed to Checkout
                </button>
              ) : (
                <div className="checkout-form">
                  <h3>Shipping Address</h3>
                  {error && <div className="error-message">{error}</div>}
                  <textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Enter your shipping address"
                    rows="4"
                  />
                  <div className="checkout-buttons">
                    <button 
                      className="place-order-btn" 
                      onClick={handlePlaceOrder}
                      disabled={loading}
                    >
                      {loading ? 'Placing Order...' : 'Place Order'}
                    </button>
                    <button 
                      className="cancel-btn" 
                      onClick={() => setShowCheckout(false)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
