import React, { useEffect, useState, useContext } from 'react';
import Userlayout from '../../../../../u_layout';
import { AuthContext } from '@/pages/component/context/authcontext';
import styles from '@/styles/borrowedbooks.module.css';
import Image from 'next/image';


Borrowedbook.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>;
};

export default function Borrowedbook() {
  const { authUser, profileId } = useContext(AuthContext); // Get the authenticated user
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
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
    if (authUser && authUser.id) {
      // Now authUser is available, make the fetch request
      const fetchBorrowedBooks = async () => {
        try {
          const res = await fetch(`http://localhost:8001/user/${authUser.id}/borrowed-books`, { 
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          const data = await res.json();

          if (res.status === 200) {
            setBorrowedBooks(data || []);  // Ensure it always sets an array, even if empty
            console.log(data)
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
    }
  }, [authUser]);  // Dependency on authUser to ensure it only runs when available

  if (loading) {
    return <div>Loading borrowed books...</div>;
  }

  return (
    <div className={styles.borr_book}>
      <h2>Borrowed Books</h2>

      {borrowedBooks.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Title</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Author</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Book Image</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Borrowed On</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Due On</th>
            </tr>
          </thead>
          <tbody>
            {borrowedBooks.map((borrowedBook) => (
              <tr key={borrowedBook._id}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{borrowedBook.book.TITLE}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{borrowedBook.book.author_name || "Unknown Author"}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  <Image src={isValidURL(borrowedBook.book.PHOTO) ? borrowedBook.book.PHOTO : defaultimage} alt={borrowedBook.book.TITLE} className="book-image" width={100} height={100} />
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  {new Date(borrowedBook.borrowDate).toLocaleDateString()}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  {new Date(borrowedBook.dueDate).toLocaleDateString()}
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

Borrowedbook.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>;
};
