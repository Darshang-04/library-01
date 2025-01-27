import AdminLayout from './layout';
import { useState } from 'react';

export default function AdminBorrow() {
  const [formData, setFormData] = useState({
    userId: '',
    bookName: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'bookName' && value.trim()) {
      fetchBookSuggestions(value);
    } else if (name === 'bookName') {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const BorrowbyAdmin = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8001/borrow-by-admin', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: formData.userId,
          booktitle: formData.bookName,
          email: formData.email,
        }),
      });

      const data = await response.json();
      setResponseMessage(data.message || 'An error occurred.');
    } catch (error) {
      setResponseMessage('Failed to send the request.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookSuggestions = async (query) => {
    try {
      const response = await fetch(`http://localhost:8001/api/autocomplete-books?q=${query}`);
      const data = await response.json();

      if (data.success) {
        setSuggestions(data.suggestions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData({ ...formData, bookName: suggestion });
    setShowSuggestions(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.userId) newErrors.userId = 'User ID is required';
    if (!formData.bookName) newErrors.bookName = 'Book Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      await BorrowbyAdmin();
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Borrow a Book</h2>
      {responseMessage && (
        <p style={{ color: responseMessage.includes('Success') ? 'green' : 'red' }}>
          {responseMessage}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="userId">User ID:</label>
          <input
            type="text"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
          />
          {errors.userId && <span style={{ color: 'red' }}>{errors.userId}</span>}
        </div>
        <div>
          <label htmlFor="bookName">Book Name:</label>
          <input
            type="text"
            id="bookName"
            name="bookName"
            value={formData.bookName}
            onChange={handleChange}
            autoComplete="off"
            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
          />
          {showSuggestions && (
            <ul
              style={{
                border: '1px solid #ccc',
                margin: '0',
                padding: '5px',
                maxHeight: '150px',
                overflowY: 'auto',
                backgroundColor: 'white',
                listStyle: 'none',
              }}
            >
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{
                    padding: '5px',
                    cursor: 'pointer',
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          {errors.bookName && <span style={{ color: 'red' }}>{errors.bookName}</span>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
          />
          {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? '#ccc' : '#4CAF50',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            cursor: 'pointer',
            marginTop: '10px',
          }}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

AdminBorrow.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
