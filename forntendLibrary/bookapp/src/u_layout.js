import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/usernav.module.css'
import Image from 'next/image';

export default function Userlayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [results, setResults] = useState([]);
  const router = useRouter();
const toggleDropdown = () => {
  setDropdownOpen(!dropdownOpen); // Toggle dropdown state
};

const closeDorpMenu = () => {
  setDropdownOpen(false); // Close dropdown when an item is clicked
};

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const handleSearch = async (e) => {
    setQuery(e.target.value)
  };

  return (
    <div className={styles.container}>
      <>
        {/* Desktop Navbar */}
        <nav className={styles.desktop_navbar}>
          <div className={styles.logo}>
            <Link href="/">library</Link>
          </div>
          <ul className={styles.nav_links}>
            <>
              <li><Link href="/component/library/clglibrary/users/home">Home</Link></li>

              {/* Dropdown for Books */}
              <li className={styles.dropdown}>
                <Link href="#">Books</Link>
                <ul className={styles.dropdown_menu}>
                  <li><Link href="/component/library/clglibrary/users/clgbooks">All Books</Link></li>
                  <li><Link href="/component/library/clglibrary/users/Ebooks">E-books</Link></li>
                  <li><Link href="/component/library/clglibrary/users/Journal">Journal</Link></li>
                  <li><Link href="/component/library/clglibrary/users/others">others</Link></li>
                </ul>
              </li>

              <li><Link href="/component/library/clglibrary/users/profile">Profile</Link></li>
              <li><Link href="/component/about">About</Link></li>
            </>
          </ul>

        </nav>

        {/* Mobile Navbar */}
        <nav className={styles.mobile_navbar}>
          <div className={styles.logo}>
            <Link href="/">Library</Link>
          </div>
          
          <div className={styles.hamburger} onClick={toggleMenu}>
            &#9776;
          </div>

          {/* Sidebar Menu for mobile */}
          <div className={`${styles.sidebar} ${menuOpen ? styles.open : ''}`}>
            <button className={styles.close_btn} onClick={closeMenu}>×</button>
            <ul className={styles.nav_links}>
              <Image src='/logo.jpg' alt='user' height={24} width={24}></Image>
              <>
                <li onClick={closeMenu}><Link href="/component/library/clglibrary/users/home">Home</Link></li>
                <li onClick={closeMenu}><Link href="/component/library/clglibrary/users/profile">Profile</Link></li>
                <li
                  className={styles.M_dropdown}
                  onClick={toggleDropdown}
                >
                Books
                  {dropdownOpen && (
                    <ul className={styles.M_dropdown_menu}>
                      <li onClick={closeMenu}>
                        <Link href="/component/library/clglibrary/users/clgbooks">All Books</Link>
                      </li>
                      <li onClick={closeMenu}>
                        <Link href="/component/library/clglibrary/users/borrowed">Borrowed Books</Link>
                      </li>
                      <li onClick={closeMenu}>
                        <Link href="/component/library/clglibrary/users/reserved">Reserved Books</Link>
                      </li>
                    </ul>
                  )}
                </li>
                <li onClick={closeMenu}><Link href="/components/about/">About</Link></li>
                <li onClick={closeMenu}><Link href="/auth/signin">Signin</Link></li>
              </>
            </ul>
          </div>
        </nav>
      </>
      {/* <main className={styles.main}> */}
      {children}
      {/* </main> */}
      <footer className={styles.footer}>
        <div className={styles.f_div}>
          {/* Contact Us Section */}
          <div className={styles.contact}>
            <h3>Contact Us</h3>
            <p>Email: support@infinity.tech</p>
            <p>Phone: +1 234 567 890</p>
            <p>Address: 123, Main Street, Tech City</p>
          </div>

          {/* Services Section */}
          <div className={styles.f_services}>
            <h3>Services</h3>
            <ul>
              <li>Web Development</li>
              <li>Mobile App Development</li>
              <li>Cloud Services</li>
            </ul>
          </div>

          {/* About Section */}
          <div className={styles.f_about}>
            <h3>About</h3>
            <p>Infinity Technology is dedicated to delivering top-notch tech solutions to empower businesses worldwide.</p>
          </div>

          {/* Social Media Links */}
          <div className={styles.social_media}>
            <h3>Follow Us</h3>
            <div className={styles.icons}>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <Image src="/facebook.png" alt="Facebook" width={24} height={24} />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                <Image src="/twitter.png" alt="Twitter" width={24} height={24} />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                <Image src="/linkedin-logo.png" alt="LinkedIn" width={24} height={24} />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <Image src="/instagram.png" alt="Instagram" width={24} height={24} />
              </a>
            </div>
          </div>
        </div>
        <p>© 2024 Infinity.technology All rights reserved.</p>
      </footer>

    </div>
  )
}
