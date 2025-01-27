import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Userlayout from '../../../../../u_layout';
import Image from 'next/image';
import { useCallback } from 'react';

export default function Allbooks() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [streamFilter, setStreamFilter] = useState('');
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('http://localhost:8001/all-books');
        const data = await res.json();

        if (res.status === 200) {
          setBooks(data.books);
          setFilteredBooks(data.books); // Initialize filtered books
        } else {
          console.error(data.msg || 'Failed to fetch books');
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    const fetchStreams = async () => {
      try {
        const res = await fetch('http://localhost:8001/all-streams'); // Endpoint for available streams
        const data = await res.json();

        if (res.status === 200) {
          setStreams(data.streams); // Set available streams
        } else {
          console.error(data.msg || 'Failed to fetch streams');
        }
      } catch (error) {
        console.error('Error fetching streams:', error);
      }
    };

    fetchBooks();
    fetchStreams();
  }, []);

  // Unified filter logic
  const applyFilters = useCallback(() => {
    let filtered = books;

    // Apply stream filter if selected
    if (streamFilter) {
      filtered = filtered.filter((book) => book.stream === streamFilter);
    }

    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBooks(filtered);
  }, [books, searchQuery, streamFilter]);

  // Handle stream filter change
  const onStreamSelect = (e) => {
    setStreamFilter(e.target.value);
  };

  // Handle search input change
  const onSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Reapply filters whenever searchQuery, streamFilter, or books change
  useEffect(() => {
    applyFilters();
  }, [searchQuery, streamFilter, books, applyFilters]);

  // Handle book click
  const handleBookClick = (book) => {
    router.push({
      pathname: `/component/library/clglibrary/admins/${book._id}/bookdetails`,
    });
  };

  return (
    <div className="books-container">
      <div className="filter-bar">
        <select onChange={onStreamSelect} value={streamFilter}>
          <option value="">Select Stream</option>
          {streams.map((stream) => (
            <option key={stream} value={stream}>
              {stream}
            </option>
          ))}
        </select>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search books by title or author..."
          value={searchQuery}
          onChange={onSearchChange}
          style={{ width: '300px', padding: '5px 10px' }}
        />
      </div>
      <div className="books-row">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div
              key={book.id}
              className="book-card"
              onClick={() => handleBookClick(book)}
            >
              <Image src={book.bookimage} alt={book.title} className="book-image" />
              <h2 className="book-title">{book.title}</h2>
              <p className="book-author">by {book.author}</p>
              <p className="book-quantity">Available: {book.quantity}</p>
            </div>
          ))
        ) : (
          <p>No books found</p>
        )}
      </div>
      <style jsx>{`
    .books-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .search-bar {
      margin-bottom: 20px;
      text-align: center;
    }

    .search-bar input {
      padding: 10px;
      width: 100%;
      max-width: 600px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }

    .books-row {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      justify-content: flex-start;
    }

    .book-card {
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      max-width: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: box-shadow 0.3s ease, transform 0.3s ease;
    }

    .book-card:hover {
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-5px);
    }

    .book-image {
      width: 100%;
      height: auto;
      max-height: 300px;
      object-fit: cover;
      border-radius: 5px;
      margin-bottom: 10px;
    }

    .book-title {
      font-size: 16px;
      color: #333;
      margin: 5px 0;
      font-weight: bold;
    }

    .book-author {
      font-size: 14px;
      color: #666;
      margin: 5px 0;
    }

    .book-quantity {
      font-size: 14px;
      color: #4CAF50;
      font-weight: bold;
    }
  `}</style>
    </div>
  );
}

Allbooks.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>;
};

