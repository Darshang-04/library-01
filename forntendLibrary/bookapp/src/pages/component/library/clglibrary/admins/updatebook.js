import AdminLayout from './layout';
import React, { useEffect, useState, useContext } from 'react';
import Image from 'next/image';
import { AuthContext } from '@/pages/component/context/authcontext';
import Lottie from 'lottie-react';
import booksrch from "./../../../../../../public/booksrch.json";

export default function AdminUpdateBook() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [filterBooks, setFilterBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const defaultimage = 'https://th.bing.com/th/id/OIP.3J5xifaktO5AjxKJFHH7oAAAAA?rs=1&pid=ImgDetMain';
  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    // Now authUser is available, make the fetch request
    const fetchBorrowedBooks = async () => {
      try {
        const res = await fetch(`http://localhost:8001/all-borrow-books`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const data = await res.json();
        // console.log("API Response:", data);

        if (res.status === 200) {
          setBorrowedBooks(data.borrowedBooks || []);  // Ensure it always sets an array, even if empty
          setFilterBooks(data.borrowedBooks || []);  // Ensure it always sets an array, even if empty
        } else {
          console.error('Failed to fetch borrowed books');
        }
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
      } finally {
        setLoading(false); // Set loading to false once the data is fetched
      }
    };

    fetchBorrowedBooks();
  }, []);  // Dependency on authUser to ensure it only runs when available

  const handleRemoveBook = async (bookId) => {
    if (!window.confirm("Are you sure you want to remove this book?")) return;

    try {
      const response = await fetch(`http://localhost:8001/remove-borrow/${bookId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to remove book.");
      }

      setFilterBooks((prevBooks) =>
        prevBooks.filter((book) => book._id !== bookId)
      );

      alert("Book removed successfully.");
    } catch (error) {
      alert(error.message);
    }
  };

  const onSearch = () => {
    const query = searchQuery.toLowerCase();
    const filtered = borrowedBooks.filter((record) =>
      record.user.firstName.toLowerCase().includes(query) ||
      record.user.lastName.toLowerCase().includes(query) ||
      record.user.studentID.toLowerCase().includes(query) ||
      record.book.TITLE.toLowerCase().includes(query)
    );
    setFilterBooks(filtered);
  };


  if (loading) {
    return <div>
      <Lottie
        animationData={booksrch}
        loop={true}
        style={{
          width: '500px', height: '500px', display: 'flex', marginLeft: '300px',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      />
    </div>
  }

  return (
    <div>
      <h2>Borrowed Books</h2>
      <div>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          style={{ backgroundColor: "white", color: "black", margin: "10px 0" }}
        />
        <button
          onClick={onSearch}
        >Search</button>
      </div>

      {filterBooks.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Student</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>studentID</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Book Image</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Borrowed On</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Due On</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Remove</th>
            </tr>
          </thead>
          <tbody>
            {filterBooks.map((borrowedBook) => (
              <tr key={borrowedBook._id}>
                <td style={{ padding: '6px', border: '1px solid #ddd' }}>{borrowedBook.user ? `${borrowedBook.user.firstName} ${borrowedBook.user.lastName}` : 'N/A'}
                </td>
                <td style={{ padding: '6px', border: '1px solid #ddd' }}>{borrowedBook.user ? `${borrowedBook.user.studentID}` : 'N/A'}</td>
                <td style={{ padding: '6px ', border: '1px solid #ddd', textAlign: 'center' }}>
                  <Image
                    src={isValidURL(borrowedBook.book) ? `${borrowedBook.book.PHOTO}` : defaultimage}
                    alt={borrowedBook.book ? `${borrowedBook.book.TITLE}` : 'N/A'}
                    objectFit='contain'
                    width={150}
                    height={150}
                  />
                  <p className='book-name'>{borrowedBook.book.TITLE}</p>
                </td>
                <td style={{ padding: '6px', border: '1px solid #ddd' }}>
                  {new Date(borrowedBook.borrowDate).toLocaleDateString()}
                </td>
                <td style={{ padding: '6px', border: '1px solid #ddd' }}>
                  {new Date(borrowedBook.dueDate).toLocaleDateString()}
                </td>
                <td style={{ padding: '6px', border: '1px solid #ddd' }}>
                  <button style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: 'red' }} onClick={() => handleRemoveBook(borrowedBook._id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>You have no borrowed books.</p>
      )}
    </div>
  );
}

AdminUpdateBook.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};