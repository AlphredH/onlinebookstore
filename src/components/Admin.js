import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/Admin.css';

function Admin() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    price: '',
    stock_quantity: '',
    pages: '',
    year: '',
    image_url: ''
  });

  useEffect(() => {
    if (!user || !user.is_admin) {
      navigate('/');
      return;
    }
    fetchBooks();
  }, [user, navigate]);

  const fetchBooks = () => {
    axios.get('http://localhost:5000/api/books')
      .then(response => {
        setBooks(response.data);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
      });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    if (editingBook) {
      // Update existing book
      axios.put(`http://localhost:5000/api/books/${editingBook.book_id}`, formData, config)
        .then(() => {
          alert('Book updated successfully!');
          resetForm();
          fetchBooks();
        })
        .catch(error => {
          console.error('Error updating book:', error);
          alert(error.response?.data?.message || 'Error updating book');
        });
    } else {
      // Add new book
      axios.post('http://localhost:5000/api/books', formData, config)
        .then(() => {
          alert('Book added successfully!');
          resetForm();
          fetchBooks();
        })
        .catch(error => {
          console.error('Error adding book:', error);
          alert(error.response?.data?.message || 'Error adding book');
        });
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      description: book.description || '',
      price: book.price,
      stock_quantity: book.stock_quantity,
      pages: book.pages || '',
      year: book.year || '',
      image_url: book.image_url || ''
    });
    setShowForm(true);
  };

  const handleDelete = (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      axios.delete(`http://localhost:5000/api/books/${bookId}`, config)
        .then(() => {
          alert('Book deleted successfully!');
          fetchBooks();
        })
        .catch(error => {
          console.error('Error deleting book:', error);
          alert(error.response?.data?.message || 'Error deleting book');
        });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      genre: '',
      description: '',
      price: '',
      stock_quantity: '',
      pages: '',
      year: '',
      image_url: ''
    });
    setEditingBook(null);
    setShowForm(false);
  };

  if (!user || !user.is_admin) {
    return null;
  }

  return (
    <div className="admin-container">
      <h1>Admin Panel</h1>
      
      <div className="admin-actions">
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Book'}
        </button>
      </div>

      {showForm && (
        <div className="book-form">
          <h2>{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Author *</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Genre *</label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price *</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Stock Quantity</label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Pages</label>
                <input
                  type="number"
                  name="pages"
                  value={formData.pages}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-primary">
                {editingBook ? 'Update Book' : 'Add Book'}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="books-table">
        <h2>All Books</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.book_id}>
                <td>{book.book_id}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>${book.price}</td>
                <td>{book.stock_quantity}</td>
                <td className="action-buttons">
                  <button 
                    className="btn-edit" 
                    onClick={() => handleEdit(book)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete" 
                    onClick={() => handleDelete(book.book_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;
