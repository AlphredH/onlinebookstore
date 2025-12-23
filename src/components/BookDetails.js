import '../css/BookDetails.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function BookDetails({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/books/${id}`)
      .then(response => {
        setBook(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching book:', error);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="book-details-container">
        <p>Loading book details...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="book-details-container">
        <div className="not-found">
          <h2>Book Not Found</h2>
          <button onClick={() => navigate('/books')} className="back-btn">Back to Books</button>
        </div>
      </div>
    );
  }

  return (
    <div className="book-details-container">
      <button onClick={() => navigate('/books')} className="back-btn">← Back to Books</button>
      
      <div className="book-details-card">
        <div className="book-image-section">
          {book.image_url ? (
            <img src={book.image_url} alt={book.title} className="book-cover-image" />
          ) : (
            <div className="book-cover">
              <h2>{book.title}</h2>
            </div>
          )}
        </div>
        
        <div className="book-info-section">
          <h1>{book.title}</h1>
          <p className="author">by {book.author}</p>
          <div className="book-meta">
            <span className="genre">{book.genre}</span>
            {book.year && <span className="year">{book.year}</span>}
            {book.pages && <span className="pages">{book.pages} pages</span>}
          </div>
          
          {book.description && (
            <div className="description">
              <h3>Description</h3>
              <p>{book.description}</p>
            </div>
          )}
          
          <div className="price-section">
            <span className="price">${book.price}</span>
            <button onClick={() => onAddToCart(book)} className="add-to-cart-btn">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
