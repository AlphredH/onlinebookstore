import '../css/Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useAuth } from '../context/AuthContext';

function Navbar({ cartCount }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <MenuBookIcon style={{ fontSize: '2rem' }} />
          <span>BookStore</span>
        </Link>
        
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            Home
          </Link>
          <Link to="/books" className="navbar-link">
            Browse Books
          </Link>
          <Link to="/about" className="navbar-link">
            About
          </Link>
          <Link to="/contact" className="navbar-link">
            Contact
          </Link>
          
          {user ? (
            <>
              <Link to="/orders" className="navbar-link">
                My Orders
              </Link>
              {user.is_admin && (
                <Link to="/admin" className="navbar-link">
                  Admin Panel
                </Link>
              )}
              <span className="navbar-user">Hello, {user.username}</span>
              <button onClick={handleLogout} className="navbar-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-btn-link">
                Register
              </Link>
            </>
          )}
          
          <Link to="/cart" className="navbar-link cart-link">
            <ShoppingCartIcon />
            <span>Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
