import React, { useState, useEffect, useRef } from 'react';
import Userlayout from '../../../../../u_layout';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useCallback } from 'react';
import styles from '../../../../../styles/allbooks.module.css';
import Lottie from 'lottie-react';
import booksrch from "./../../../../../../public/booksrch.json";
import { FaSearch } from 'react-icons/fa';
import SearchFilterBooks from './searchfilterbooks';
import { faL } from '@fortawesome/free-solid-svg-icons';

export default function ClgBooks() {
  const router = useRouter();
  const [searchType, setSearchType] = useState(''); // Tracks which input is clicked
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [query, setQuery] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSearchFilter, setShowSearchFilter] = useState(true); 
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const defaultimage = 'https://th.bing.com/th/id/OIP.3J5xifaktO5AjxKJFHH7oAAAAA?rs=1&pid=ImgDetMain';
  const subjectInputRef = useRef(null);
  const popupRef = useRef();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };


  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/get-clg-books?=page=${currentPage}`);
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      setBooks(data.clgbooks);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  // popup for search
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  const handleSearchResults = (results) => {
    setBooks(results);
    // console.log("main component ",results)
  }

  const handleCloseSearchFilter = () => {
    setShowSearchFilter(false); // Set to false to hide the SearchFilterBooks component
  };

  const handleClosePopup = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setIsPopupOpen(false); // Close popup if clicked outside
      setSearchType(''); // reset search
    }
  };

  useEffect(() => {
    if (isPopupOpen) {
      document.addEventListener('mousedown', handleClosePopup);
    } else {
      document.removeEventListener('mousedown', handleClosePopup);
    }

    return () => {
      document.removeEventListener('mousedown', handleClosePopup);
    };
  }, [isPopupOpen]);
  const handleInputFocus = (type) => {
    setSearchType(type);
    setShowSearchFilter(true)
    setIsPopupOpen(false)
  };

  // subject filter
  const fetchSubjects = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/subjects`);
      if (!response.ok) {
        throw new Error('Failed to fetch subjects');
      }
      const data = await response.json();
      setSubjects(data.map((subject) => subject.SUB_NAME));
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  }, []);

  const handleSubjectChange = (e) => {
    const value = e.target.value;
    setSubject(value);
    if (value.trim() === '') {
      fetchBooks();
      setShowSuggestions(false);
    } else {
      setShowSuggestions(true);
      setSelectedSuggestionIndex(-1); // Reset suggestion index
    }
  };

  const handleSubjectSelect = (selectedSubject) => {
    setSubject(selectedSubject);
    setShowSuggestions(false);
  }

  const searchBooks = async () => {

    setLoading(true);
    try {
      const url = `${backendUrl}/search-by-filter?subname=${subject}&query=${query}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to search books');
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchSubjects();
  }, [currentPage, fetchBooks, fetchSubjects]);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (subjectInputRef.current && !subjectInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {

    if (e.key === 'ArrowDown') {
      // Move selection down
      setSelectedSuggestionIndex((prevIndex) =>
        prevIndex < subjects.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === 'ArrowUp') {
      // Move selection up
      setSelectedSuggestionIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : 0
      );
    } else if (e.key === 'Enter' && selectedSuggestionIndex >= 0) {
      // Select the highlighted suggestion
      handleSubjectSelect(subjects[selectedSuggestionIndex]);
      e.preventDefault(); // Prevent form submission on Enter
    }
  };

  useEffect(() => {
    if (selectedSuggestionIndex >= 0 && subjectInputRef.current) {
      const suggestionList = subjectInputRef.current.querySelector('.' + styles.suggestions);
      const selectedItem = suggestionList?.children[selectedSuggestionIndex];

      if (selectedItem) {
        // Scroll to the selected item
        selectedItem.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest', // Ensures smooth scrolling without jumping
        });
      }
    }
  }, [selectedSuggestionIndex]);

  const handleBookClick = (book) => {
    router.push({
      pathname: `/component/library/clglibrary/admins/${book._id}/bookdetails`,
    });
  };

  return (
    <div className={styles.books_container}>
      <div className={styles.control_bar}>
        <h1>All Books</h1>
        <div>
          {/* Search Icon */}
          <div className={styles.filter} onClick={togglePopup}>
            <FaSearch className={styles.search_icon} />
          </div>

          {/* Initial Popup */}
          {isPopupOpen && (
            <div className={styles.popup_backdrop}>
              <div ref={popupRef} className={styles.popup}>
                <div
                  className="type_of_search"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <div>
                    <label className="label" style={{ fontSize: '12px' }}>
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="Search book by title"
                      className={styles.popup_input}
                      onFocus={() => handleInputFocus('title')}
                    />
                  </div>
                  <span style={{ marginTop: '13px' }}>or</span>
                  <div>
                    <label className="label" style={{ fontSize: '12px' }}>
                      Author
                    </label>
                    <input
                      type="text"
                      placeholder="Search book by author"
                      className={styles.popup_input}
                      onFocus={() => handleInputFocus('author')}
                    />
                  </div>
                </div>
                <label className="label" style={{ fontSize: '12px' }}>
                  Subject filter
                </label>
                <input
                  type="text"
                  placeholder="Filter books by subject..."
                  className={styles.popup_input}
                  onFocus={() => handleInputFocus('subject')}
                />
                <button
                  onClick={togglePopup}
                  className={styles.popup_button}
                >
                  Search
                </button>
              </div>
            </div>
          )}

        </div>
        <div className={styles.search_bar}>
          <input
            type="text"
            placeholder="Search books by title or author..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchBooks()}
          />
          <div ref={subjectInputRef} className={styles.subject_input_container}>
            <input
              type="text"
              placeholder="Search by subject..."
              value={subject}
              onChange={handleSubjectChange}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
            />
            {showSuggestions && (
              <div className={styles.suggestions}>
                {subjects
                  .filter((s) => s.toLowerCase().includes(subject.toLowerCase()))
                  .map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSubjectSelect(suggestion)}
                      className={`${styles.suggestion_item} ${index === selectedSuggestionIndex ? styles.selected : ''
                        }`}
                    >
                      {suggestion}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
        <button className={styles.submit_button} onClick={searchBooks}>
          Search
        </button>

      </div>
      {loading && <div className={styles.loadingOverlay}>

        <Lottie
          animationData={booksrch}
          loop={true}
          style={{ width: '500px', height: '500px', marginLeft: '400px' }}
        />
      </div>}

      <div className={styles.books_row}>
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book._id} className={styles.book_card} onClick={() => handleBookClick(book)}>
              <div className={styles.book_image}>
                <Image
                  src={isValidURL(book.PHOTO) ? book.PHOTO : defaultimage}
                  alt={book.TITLE}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <h2 className={styles.book_title}>{book.TITLE}</h2>
              <p className={styles.book_author}>by {book.authorName || 'Unknown Author'}</p>
              <p className={styles.book_quantity}>Available: {book.TOTAL_VOL}</p>
            </div>
          ))
        ) : (
          <p>No Book found</p>
        )}
      </div>

      <div className={styles.pagination}>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
      {searchType && showSearchFilter && (
        <div className={styles.single_input}>
          <SearchFilterBooks type={searchType} onSearchResults={handleSearchResults} onClose={handleCloseSearchFilter}/>
        </div>
      )}
    </div>
  );
}

ClgBooks.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>;
};
