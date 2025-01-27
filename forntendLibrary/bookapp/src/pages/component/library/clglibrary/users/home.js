import React, { useState, useEffect } from 'react';
import Userlayout from '../../../../../u_layout';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false); // Set loading to false initially
  const defaultimage = 'https://th.bing.com/th/id/OIP.3J5xifaktO5AjxKJFHH7oAAAAA?rs=1&pid=ImgDetMain';
  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true); // Show loading until data is fetched
      try {
        const response = await fetch(`${backendUrl}/get-clg-books?startIndex=10&endIndex=20`); // Adjust the API endpoint as needed
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Failed to fetch books');
        }
        const data = await response.json();
        setBooks(data.clgbooks); // Directly set the fetched books
      } catch (err) {
        console.error('Error fetching books:', err.message);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchBooks();
  }, [backendUrl]);

  const handleBookClick = (book) => {
    router.push({
      pathname: `/component/library/clglibrary/admins/${book._id}/bookdetails`,
    });
  };

    // Carousel functionality
    useEffect(() => {
      const carousel = document.querySelector(`.${styles.carrousel}`);
      let scrollAmount = 0;
      const cardStyle = getComputedStyle(carousel.querySelector(`.${styles.card}`));
      const slideWidth = parseInt(cardStyle.width) + parseInt(cardStyle.marginRight);
    
      function autoSlide() {
        scrollAmount += slideWidth;
        if (scrollAmount >= carousel.scrollWidth - carousel.clientWidth) {
          scrollAmount = 0;
        }
        carousel.scroll({
          left: scrollAmount,
          behavior: 'smooth',
        });
      }
    
      const interval = setInterval(autoSlide, 2000); // Auto-slide every 2 seconds
      return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

  return (
    <div className={styles.books_container}>
      <div className={styles.home}>
      <div className={styles.text}>
        <h1>The more that you read, the more things you know.</h1>
        <p>The more that you learn the more places you go.</p>
        </div>
        {/* <Image src="../../asset/images/backgrnd.jpg" alt="Example Image" layout='fill' objectFit='contain' width={200} height={200}/> */}
        <div className={styles.slide}>
    <div className={styles.conteudo}>
        <div className={styles.carrousel}>
            <article className={styles.card}>
              <Image src='/lib1.jpg' alt='1' height={200} width={300} style={{borderRadius: '30px'}}></Image>
            </article>
            <article className={styles.card}> 
            <Image src='/lib2.jpg' alt='2' height={200} width={300} style={{borderRadius: '30px'}}></Image>
            </article>
            <article className={styles.card}>  
            <Image src='/lib3.jpg' alt='3' height={200} width={300} style={{borderRadius: '30px'}}></Image> 
            </article>
            <article className={styles.card}> 
            <Image src='/lib4.jpg' alt='4' height={200} width={300} style={{borderRadius: '30px'}}></Image>              
            </article>
            <article className={styles.card}>  
            <Image src='/lib5.jpg' alt='5' height={200} width={300} style={{borderRadius: '30px'}}></Image>   
            </article>
            <article className={styles.card}>  
            <Image src='/lib6.jpg' alt='1' height={200} width={300} style={{borderRadius: '30px'}}></Image>            
            </article>
            <article className={styles.card}>   
            <Image src='/lib7.jpg' alt='1' height={200} width={300} style={{borderRadius: '30px'}}></Image>              
            </article>
        </div>
        </div> 
     </div>

      </div>

      <div className={styles.section2}>
        <h1>Books Categories</h1>
      </div>
      <div className={styles.search_bar}>
        <input
          type="text"
          placeholder="Search books by title or author..."
          onClick={() => router.push('/component/library/clglibrary/users/searchitems')}
        />
      </div>
      <div className={styles.cat1}><h3>All Books</h3></div>
      <div className={styles.books}>
      <div className={styles.books_row}>
        {loading ? (
          <p>Loading books...</p> // Show loading while fetching
        ) : books.length > 0 ? (
          books.map((book) => (
            <div
              key={book._id}
              className={styles.book_card}
              onClick={() => handleBookClick(book)}
            >
              <div className={styles.book_image}>
                <Image
                  src={isValidURL(book.PHOTO) ? book.PHOTO : defaultimage}
                  alt={book.TITLE}
                  layout="fill" // Makes the image fill its parent container
                  objectFit="contain" // Maintains aspect ratio while covering the container
                />
              </div>
              <h2 className={styles.book_title}>{book.TITLE}</h2>
              <p className={styles.book_author}>by {book.authorName}</p>
              <p className={styles.book_quantity}>Available: {book.TOTAL_VOL}</p>
            </div>
          ))
        ) : (
          <p>No books found</p> // Show only if books array is empty after loading
        )}
      </div>
    </div>
    <div className={styles.mBooks}>
      <Link href="/component/library/clglibrary/users/clgbooks"><p>View More</p></Link>
        </div>

    </div>
  );
}

Home.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>;
};
