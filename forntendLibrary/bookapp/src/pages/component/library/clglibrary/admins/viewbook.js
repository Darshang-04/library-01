// pages/viewBooks.js
import AdminLayout from './layout';
import Userlayout from '@/u_layout';
import { useRef } from 'react';
import { useState, useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { AuthContext } from '@/pages/component/context/authcontext';
import styles from "@/styles/allbooks.module.css";
import { Padding } from '@mui/icons-material';
import Lottie from 'lottie-react';
import booksrch from "./../../../../../../public/booksrch.json";


export default function AdminViewBook() {
  const { authUser } = useContext(AuthContext)
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([])
  const [subject, setSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const subjectInputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [totalPages, setTotalPages] = useState(1); // Total pages state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  // Total pages state
  // const [selectedOption, setSelectedOption] = useState('viewbook');
  // const [searchQuery, setSearchQuery] = useState('');
  // const [filteredBooks, setFilteredBooks] = useState([]);
  // const [streamFilter, setStreamFilter] = useState(''); // New state for stream filter
  // const [streams, setStreams] = useState([]);
  const defaultimage = 'https://th.bing.com/th/id/OIP.3J5xifaktO5AjxKJFHH7oAAAAA?rs=1&pid=ImgDetMain';
  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const Layout = authUser.role === 'user' ? Userlayout : AdminLayout;

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/get-clg-books?page=${currentPage}`);
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
  }, [currentPage]);  // Memoize based on currentPage

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
  }, []);  // Memoize once since it doesn't depend on any other state

  // Adding fetchBooks and fetchSubjects to the dependency array
  useEffect(() => {
    fetchBooks();
    fetchSubjects();
  }, [currentPage, fetchBooks, fetchSubjects]);


  const handleSubjectChange = (e) => {
    const value = e.target.value;
    setSubject(value);

    if (value.trim() === '') {
      // If subject input is cleared, fetch all books
      // fetchBooks();
      setShowSuggestions(false); // Hide suggestions
    } else {
      setShowSuggestions(true);
    }
  };

  const handleSubjectSelect = (selectedSubject) => {
    setSubject(selectedSubject); // Set the selected subject to the input
    setShowSuggestions(false); // Hide the suggestions dropdown
  };

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

  // const applyFilters = () => {
  //   let filtered = books;

  //   // Apply stream filter if selected
  //   if (streamFilter) {
  //     filtered = filtered.filter((book) => book.stream === streamFilter);
  //   }

  //   // Apply search query filter
  //   if (searchQuery) {
  //     filtered = filtered.filter(
  //       (book) =>
  //         book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         book.author.toLowerCase().includes(searchQuery.toLowerCase())
  //     );
  //   }

  //   setFilteredBooks(filtered);
  // };

  // // Handle stream filter change
  // const onStreamSelect = (e) => {
  //   setStreamFilter(e.target.value);
  // };

  // // Handle search input change
  // const onSearchChange = (e) => {
  //   setSearchQuery(e.target.value);
  // };

  // // Reapply filters whenever searchQuery, streamFilter, or books change
  // useEffect(() => {
  //   applyFilters();
  // }, [searchQuery, streamFilter, books]);

  // Search books by query
  // const onSearchChange = async (e) => {
  //   const query = e.target.value;
  //   setSearchQuery(query);

  //   try {
  //     const response = await fetch(`http://localhost:8000/search-books?query=${query}`);
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch search results');
  //     }

  //     const data = await response.json();
  //     setFilteredBooks(data.books);
  //   } catch (error) {
  //     console.error('Error fetching search results:', error);
  //     setFilteredBooks([]);
  //   }
  // };

  const handleBookClick = (book) => {
    router.push({
      pathname: `/component/library/clglibrary/admins/${book._id}/bookdetails`
    });
  };

  const handleComponent = (value) => {
    setSelectedOption(value); // Update the selected option in state
    router.push(`/component/library/clglibrary/admins/${value}`); // Navigate to the respective page
  };

  // useEffect(() => {
  //   const currentPath = router.pathname.split('/').pop(); // Get the last part of the path
  //   setSelectedOption(currentPath);
  // }, [router.pathname]);

  return (
    <Layout>
      <div className={styles.books_container} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 className={styles.title}>Available Books</h1>
        {/* <div style={{ margin: '10px 10px', display:'flex', }}>
        <select
          style={{ margin: "0px 10px", padding:'5px 10px', fontSize:'20px' }}
          value={selectedOption}
          onChange={(e) => handleComponent(e.target.value)}
        >
          <option value="viewbook">All Book</option>
          <option value="viewebook">All E-Book</option>
          <option value="novel">Novel</option>
          <option value="story">Story</option>
        </select>
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
          style={{width:'300px', padding:'5px 10px'}}
        />
      </div>
      </div> */}
        <div className={styles.search_bar} style={{ padding: '10px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', }}>
          <div className={styles.subject_input_container}>
            <input
              type="text"
              placeholder="Search books by title or author..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div ref={subjectInputRef} className={styles.subject_input_container}>
            <input
              type="text"
              placeholder="Search by subject..."
              value={subject}
              onChange={handleSubjectChange}
              onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && (
              <div className={styles.suggestions}>
                {subjects
                  .filter((s) =>
                    typeof s === 'string' && s.toLowerCase().includes(subject.toLowerCase())
                  )
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
          <button
            className={styles.submit_button}
            onClick={searchBooks}
            style={{ padding: '5px 20px', marginLeft: '40px' }}
          >
            Search
          </button>
        </div>
        {loading && <div className={styles.loadingOverlay}>
          <Lottie
            animationData={booksrch}
            loop={true}
            style={{ width: '500px', height: '500px' }}
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
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </Layout>
  );
}

