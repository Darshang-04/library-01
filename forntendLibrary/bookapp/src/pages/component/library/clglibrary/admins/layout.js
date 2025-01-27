import React, { useState, useEffect } from "react";
import styles from "../../../../../styles/layout.module.css";
import Link from "next/link";
import NextNProgress from 'nextjs-progressbar';

export default function AdminLayout({ children }) {
  const [showDot, setShowDot] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const reloadPage = () => {
    window.location.reload();
  };

  // Fetch member count and pending requests count
  useEffect(() => {
    const fetchRequestCount = async () => {
      try {
        const response = await fetch("http://localhost:8001/borrow-requests/count-pending");
        const data = await response.json();
        setShowDot(data.count);  // Set the member count
      } catch (error) {
        console.error("Error fetching member count:", error);
      }
    };
    const fetchWaitCount = async () => {
      try {
        const response = await fetch("http://localhost:8001/waitlist-requests/count-pending");
        const data = await response.json();
        setShowDot(data.count);  // Set the member count
      } catch (error) {
        console.error("Error fetching member count:", error);
      }
    };

    fetchRequestCount();
    fetchWaitCount();

    // Poll for updates every 60 seconds (for the pending requests count)
    const interval = setInterval([fetchRequestCount, fetchWaitCount], 60000);
    return () => clearInterval(interval);  // Cleanup interval on unmount
  }, []);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <NextNProgress
        color="#32CD32"       
        startPosition={0.3} 
        stopDelayMs={200}   
        height={3}          
        showOnShallow={true} 
      />
      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
      </header>
      <div className={styles.body}>
        <nav className={styles.sidebar}>
          <ul>
            <li>
              <Link href="/component/library/clglibrary/admins/home" replace>Dashboard</Link>
            </li>
            <li>
              <Link href="/component/library/clglibrary/admins/member" replace>Members</Link>
            </li>
            {/* Dropdown Menu for Add Books */}
            <li className={styles.dropdown}>
              <div
                className={styles.dropdownToggle}
                onClick={toggleDropdown}
              >
                Add Books
              </div>
              {dropdownOpen && (
                <ul className={styles.dropdownMenu}>
                  <li>
                    <Link href="/component/library/clglibrary/admins/addbook" replace>
                      Add Books
                    </Link>
                  </li>
                  <li>
                    <Link href="/component/library/clglibrary/admins/addebook" replace>
                      Add E-Books
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link href="/component/library/clglibrary/admins/viewbook" replace>View Books</Link>
            </li>
            <li>
              <Link href="/component/library/clglibrary/admins/updatebook" replace>Update borrows</Link>
            </li>
            <li>
              <Link href="/component/library/clglibrary/admins/getbrequest" replace>
                Request Book
                {showDot && <span className={styles.blueDot}></span>}
              </Link>
            </li>
            <li>
              <Link href="/component/library/clglibrary/admins/adminborrow" replace>Admin Borrow</Link>
            </li>
            <li>
              <Link href="/component/library/clglibrary/admins/history" replace>History</Link>
            </li>
            <li>
              <Link href="/component/library/clglibrary/admins/penalties" replace>Penalties</Link>
            </li>
            <li>
            <button
                  onClick={reloadPage}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    color: 'blue',
                    textDecoration: 'underline',
                  }}
                >
                  Reload Page
                </button>
            </li>
          </ul>
        </nav>

        <main className={styles.main}>
          {children}
        </main>
      </div>

      <footer className={styles.footer}>
        <p>© 2024 Infinity.technology All rights reserved.</p>
      </footer>
    </div>
  );
}
