import '../css/BookList.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BookList({ onAddToCart }) {
  const navigate = useNavigate();
  const [books] = useState([
    { id: 1, title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 12.99, genre: 'Fiction' },
    { id: 2, title: '1984', author: 'George Orwell', price: 14.99, genre: 'Fiction' },
    { id: 3, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 10.99, genre: 'Fiction' },
    { id: 4, title: 'Harry Potter', author: 'J.K. Rowling', price: 19.99, genre: 'Fantasy' },
    { id: 5, title: 'The Hobbit', author: 'J.R.R. Tolkien', price: 15.99, genre: 'Fantasy' },
    { id: 6, title: 'Pride and Prejudice', author: 'Jane Austen', price: 11.99, genre: 'Romance' },
    { id: 7, title: 'The Catcher in the Rye', author: 'J.D. Salinger', price: 13.99, genre: 'Fiction' },
    { id: 8, title: 'Lord of the Flies', author: 'William Golding', price: 12.49, genre: 'Fiction' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div key={book.id} className="book-card">
            <div className="book-info" onClick={() => navigate(`/book/${book.id}`)} style={{ cursor: 'pointer' }}>
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
