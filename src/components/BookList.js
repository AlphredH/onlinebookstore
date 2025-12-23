import '../css/BookList.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function BookList({ onAddToCart }) {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    axios.get('http://localhost:5000/api/books')
      .then(response => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
        setLoading(false);
      });
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="book-list-container"><p>Loading books...</p></div>;
  }

  return (
    <div className="book-list-container">
      <div className="header">
        <h1>Online Bookstore</h1>
        <p>Browse and purchase your favorite books</p>
      </div>

      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title or author..."
          className="search-input"
        />
      </div>

      <div className="books-grid">
        {filteredBooks.map(book => (
          <div key={book.book_id} className="book-card">
            <div className="book-info" onClick={() => navigate(`/book/${book.book_id}`)} style={{ cursor: 'pointer' }}>
              {book.image_url && (
                <img src={book.image_url} alt={book.title} className="book-image" />
              )}
              <h3>{book.title}</h3>
              <p className="author">by {book.author}</p>
              <p className="genre">{book.genre}</p>
              <p className="price">${book.price}</p>
            </div>
            <button onClick={() => onAddToCart(book)} className="add-btn">
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <p className="no-results">No books found</p>
      )}
    </div>
  );
}

export default BookList;
