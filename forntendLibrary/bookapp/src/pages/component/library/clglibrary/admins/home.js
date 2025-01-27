import AdminLayout from './layout';
import React from 'react';
import { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import styles from '@/styles/dashboard.module.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faArrowUp, faBookReader, faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export async function getServerSideProps() {
  const res = await fetch("http://localhost:8001/all-members");
  const data = await res.json();

  const res2 = await fetch("http://localhost:8001/all-books");
  const data2 = await res2.json();

  const res3 = await fetch('http://localhost:8001/all-borrow-books');
  const data3 = await res3.json()

  return {
    props: {
      memberLength: data.userCount,
      bookslen: data2.booklen,
      allborrowed: data3.allborrows || 0
    },
  };
}

export default function HomePage({ memberLength, bookslen, allborrowed }) {
  const [duetommorow, setDueTommorow] = useState([]);
  const [duetoday, setDueToday] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 2;

  const [barData, setBarData] = useState({
    labels: [],
    datasets: [
      {
        label: "Most Issued Books",
        data: [],
        backgroundColor: "#3498db",
      },
    ],
  });

  // Calculate total pages
  const totalPages = Math.ceil(duetommorow.length || duetoday.length / recordsPerPage);

  // Slice data to show only current page records
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = duetommorow.slice(startIndex, startIndex + recordsPerPage);
  const todayrecords = duetoday.slice(startIndex, startIndex + recordsPerPage);

  // Handlers for pagination
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // bar graph chart
  useEffect(() => {
    const fetchMostBorrowedBooks = async () => {
      try {
        const response = await fetch("http://localhost:8001/most-borrowed"); // Replace with your API endpoint
        const result = await response.json();

        if (result.success) {
          const bookTitles = result.data.map((book) => book.bookTitle);
          const borrowCounts = result.data.map((book) => book.borrowCount);

          // Update barData
          setBarData({
            labels: bookTitles,
            datasets: [
              {
                label: "Most Issued Books",
                data: borrowCounts,
                backgroundColor: "#3498db",
              },
            ],
          });
        } else {
          throw new Error(result.message || "Failed to fetch data.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMostBorrowedBooks();
  }, []);


  const doughnutData = {
    labels: ['Issued Books', 'Borrowed Books', 'Returned Books', 'Overdue Books'],
    datasets: [
      {
        label: 'Books Statistics',
        data: [26, 17, 5, 4],
        backgroundColor: ['#3498db', '#2ecc71', '#f39c12', '#e74c3c'],
      },
    ],
  };

  const fetchTommorow = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8001/tmr-due-books");
      const data = await response.json();

      if (data.success) {
        setDueTommorow(data.dueBooks);
      } else {
        setError("Failed to fetch books.");
      }
    } catch (err) {
      console.error("Error fetching due books:", err);
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const fetchDueBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8001/today-due-books");
      const data = await response.json();

      if (data.success) {
        setDueToday(data.todayDue);
      } else {
        setError("Failed to fetch books.");
      }
    } catch (err) {
      console.error("Error fetching due books:", err);
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDueBooks();
    fetchTommorow();

    // Optionally refresh every minute
    const interval = setInterval(fetchDueBooks, 60000);
    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  const handleRouting = (path) => {
    router.push(`/component/library/clglibrary/admins/${path}`)
  }

  return (
    <div className={styles.dashboardMain}>
      {/* Cards Section */}
      <div className={styles.cardGrid}>
        <div className={styles.wrap}>
          <div className={`${styles.card} ${styles.blue}`}>
            <div>
              <h3>{memberLength || 0}</h3>
              <p>Members</p>
            </div>
            <FontAwesomeIcon icon={faPeopleGroup} size="3x" />
          </div>
          <div className={`${styles.more} ${styles.btnblue}`} onClick={() => handleRouting('member')}>More Info</div>
        </div>
        <div className={styles.wrap}>
          <div className={`${styles.card} ${styles.green}`}>
            <div>
              <h3>{bookslen || 0}</h3>
              <p>Books</p>
            </div>
            <FontAwesomeIcon icon={faBook} size="3x" />
          </div>
          <div className={`${styles.more} ${styles.btngreen}`} onClick={() => handleRouting('viewbook')}>More Info</div>
        </div>
        <div className={styles.wrap}>
          <div className={`${styles.card} ${styles.red}`}>
            <div>
              <h3>{allborrowed}</h3>
              <p>Borrowed Book</p>
            </div>
            <FontAwesomeIcon icon={faBookReader} size="3x" />
          </div>
          <div className={`${styles.more} ${styles.btnred}`} onClick={() => handleRouting('updatebook')}>More Info</div>
        </div>
        <div className={styles.wrap}>
          <div className={`${styles.card} ${styles.orange}`}>
            <div>
              <h3>10</h3>
              <p>Returned Book</p>
            </div>
            <FontAwesomeIcon icon={faArrowUp} size="3x" />
          </div>
          <div className={`${styles.more} ${styles.btnorange}`}>More Info</div>
        </div>
      </div>

      {/* Tables Section */}
      <div className={styles.tableContainer}>
        <h3>Today Dues</h3>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Book Name</th>
                  <th>Borrower Name</th>
                  <th>Date Borrow</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.length > 0 ? (
                  currentRecords.map((book) => (
                    <tr key={book._id}>
                      <td>{book.title}</td>
                      <td>
                        {book.user?.firstName || "N/A"} {book.user?.lastName || ""}
                      </td>
                      <td>
                        {new Date(book.borrowDate).toLocaleDateString("en-US")}
                      </td>
                      <td>{book.user?.email || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No Dues for Today</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Buttons */}
            <div className={styles.pagination}>
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
              >
                Next
              </button>
            </div>
          </> 
        )}
      </div>

      <div className={styles.tableContainer}>
        <h3>Tommorrow Dues</h3>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Book Name</th>
                  <th>Borrower Name</th>
                  <th>Date Borrow</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {todayrecords.length > 0 ? (
                  todayrecords.map((book) => (
                    <tr key={book._id}>
                      <td>{book.title}</td>
                      <td>
                        {book.user?.firstName || "N/A"} {book.user?.lastName || ""}
                      </td>
                      <td>
                        {new Date(book.borrowDate).toLocaleDateString("en-US")}
                      </td>
                      <td>{book.user?.email || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No Dues for Today</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Buttons */}
            <div className={styles.pagination}>
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className={styles.chartsContainer}>
        <div className={styles.chart}>
          <h3>Most Issued Books</h3>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : (
            <Bar data={barData} options={{ responsive: true }} />
          )}
        </div>
        <div className={styles.graph}>
          <h3>Books Issued Till Date</h3>
          <Doughnut data={doughnutData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
}

HomePage.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
