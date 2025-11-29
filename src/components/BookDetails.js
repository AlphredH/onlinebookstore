import '../css/BookDetails.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function BookDetails({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const allBooks = [
    { id: 1, title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 12.99, genre: 'Fiction', description: 'A gripping tale of racial injustice and childhood innocence in the American South. This Pulitzer Prize-winning novel has captivated readers for generations.', year: 1960, pages: 324 },
    { id: 2, title: '1984', author: 'George Orwell', price: 14.99, genre: 'Fiction', description: 'A dystopian masterpiece that explores themes of totalitarianism, surveillance, and the power of language. A must-read classic that remains relevant today.', year: 1949, pages: 328 },
    { id: 3, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 10.99, genre: 'Fiction', description: 'Set in the Jazz Age, this novel tells the story of the mysterious Jay Gatsby and his obsession with Daisy Buchanan. A brilliant critique of the American Dream.', year: 1925, pages: 180 },
    { id: 4, title: 'Harry Potter', author: 'J.K. Rowling', price: 19.99, genre: 'Fantasy', description: 'The magical journey begins as a young wizard discovers his true heritage and embarks on adventures at Hogwarts School of Witchcraft and Wizardry.', year: 1997, pages: 309 },
    { id: 5, title: 'The Hobbit', author: 'J.R.R. Tolkien', price: 15.99, genre: 'Fantasy', description: 'Follow Bilbo Baggins on an unexpected journey to reclaim a treasure guarded by a dragon. An enchanting prelude to The Lord of the Rings.', year: 1937, pages: 310 },
    { id: 6, title: 'Pride and Prejudice', author: 'Jane Austen', price: 11.99, genre: 'Romance', description: 'A romantic tale of manners featuring the spirited Elizabeth Bennet and the proud Mr. Darcy. A timeless classic exploring love, class, and society.', year: 1813, pages: 432 },
    { id: 7, title: 'The Catcher in the Rye', author: 'J.D. Salinger', price: 13.99, genre: 'Fiction', description: 'A controversial and influential novel following teenager Holden Caulfield through New York City, exploring themes of alienation and rebellion.', year: 1951, pages: 277 },
    { id: 8, title: 'Lord of the Flies', author: 'William Golding', price: 12.49, genre: 'Fiction', description: 'A powerful allegory about civilization and human nature as a group of boys stranded on an island descend into savagery.', year: 1954, pages: 224 }
  ];

  const book = allBooks.find(b => b.id === parseInt(id));

  if (!book) {
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
          <div className="book-cover">
            <h2>{book.title}</h2>
          </div>
        </div>
        
        <div className="book-info-section">
          <h1>{book.title}</h1>
          <p className="author">by {book.author}</p>
          <div className="book-meta">
            <span className="genre">{book.genre}</span>
            <span className="year">{book.year}</span>
            <span className="pages">{book.pages} pages</span>
          </div>
          
          <div className="description">
            <h3>Description</h3>
            <p>{book.description}</p>
          </div>
          
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
