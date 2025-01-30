import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/searchfilter.module.css';
import Userlayout from '@/u_layout';

const SearchFilterBooks = ({ type, onSearchResults, onClose }) => {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [subjects, setSubjects] = useState([]); // State for storing subjects
  const [formData, setFormData] = useState({ bookName: '' });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [subjectShowSuggestions, setSubjectShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const subjectInputRef = useRef(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Fetch available subjects
  const fetchSubjects = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/subjects`);
      if (!response.ok) {
        throw new Error('Failed to fetch subjects');
      }
      const data = await response.json();
      setSubjects(data.map((subject) => subject.SUB_NAME)); // Update subjects state
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  }, []);

  const handleChange = (e) => {
    const { value } = e.target;
    setFormData({ bookName: value }); // Update book name in formData

    if (value.length > 1) {
      // Only fetch suggestions if input length > 1
      fetchBookSuggestions(value); // Call the API to fetch suggestions
    } else {
      setSuggestions([]); // Clear suggestions if input length is less than 2
      setShowSuggestions(false);
    }
  };

  // Fetch book suggestions based on input
  const fetchBookSuggestions = async (query) => {
    if (type === 'title') {
      try {
        const response = await fetch(`${backendUrl}/api/autocomplete-books?q=${query}`);
        const data = await response.json();
        if (data.success) {
          setSuggestions(data.suggestions.map((author) => author.AUTH_NAME));
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error('Error fetching book suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else if (type === 'author') {
      try {
        const response = await fetch(`${backendUrl}/api/autocomplete-author?q=${query}`);
        const data = await response.json();
        if (data.success) {
          setSuggestions(data.suggestions);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error('Error fetching author suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (type === 'title') {
      setFormData({ bookName: suggestion });
    } else if (type === 'author') {
      setFormData({ bookName: suggestion });
    }
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Handle subject input change
  const handleSubjectChange = (e) => {
    const value = e.target.value;
    setSubject(value);
    setSubjectShowSuggestions(true);
  };

  // Handle subject select from suggestions
  const handleSubjectSelect = (selectedSubject) => {
    setSubject(selectedSubject);
    setSubjectShowSuggestions(false);
  };

  // Search books based on input query and subject
  const searchBooks = async (query) => {
    setLoading(true);
    try {
      const url = `${backendUrl}/search-by-filter?subname=${subject}&query=${query}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to search books');
      }
      const data = await response.json();
      onSearchResults(data);
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle "Enter" key press for searching
  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      if (type === 'subject' && subject.trim()) {
        await searchBooks(subject);
        onClose();
      } else if (formData.bookName.trim()) {
        await searchBooks(formData.bookName);
        onClose();
      }
    }
  };
  
  // Fetch subjects when component mounts
  useEffect(() => {
    if (type === 'subject') {
      fetchSubjects(); // Fetch subjects only when type is 'subject'
    }
  }, [fetchSubjects, type]);

  return (
    <div className={styles.container}>
      <div className={styles.search_input}>
        {type === 'subject' ? (
          // Subject input display
          <div ref={subjectInputRef} className={styles.subject_input_container}>
            <input
              type="text"
              placeholder="Search by subject..."
              value={subject}
              onChange={handleSubjectChange}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyPress}
            />
            {subjectShowSuggestions && (
              <div className={styles.suggestions}>
                {subjects
                  .filter((s) => s.toLowerCase().includes(subject.toLowerCase()))
                  .map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSubjectSelect(suggestion)}
                      className={styles.suggestion_item}
                    >
                      {suggestion}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ) : (
          // Default search input
          <div>
            <input
              type="text"
              placeholder="Search here..."
              name="bookName"
              value={formData.bookName}
              onChange={handleChange}
              
              onKeyDown={handleKeyPress}
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className={styles.suggestions}>
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={styles.suggestion_item}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

SearchFilterBooks.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>;
};

export default SearchFilterBooks;
