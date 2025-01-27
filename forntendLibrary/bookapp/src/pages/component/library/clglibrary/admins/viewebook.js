import AdminLayout from './layout';
import Userlayout from '@/u_layout';
import { useEffect, useState, useContext } from 'react';
import styles from '@/styles/ebook.module.css';
import { useRouter } from 'next/router';
import { AuthContext } from '@/pages/component/context/authcontext';
import Image from 'next/image';


export default function ViewEBook() {
  const { authUser } = useContext(AuthContext);
  const [ebooks, setEBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOption, setSelectedOption] = useState('viewbook');
  const router = useRouter();

  const Layout = authUser.role === 'user' ? Userlayout : AdminLayout;

  // Fetch eBooks from the backend API
  useEffect(() => {
    const fetchEBooks = async () => {
      try {
        const response = await fetch('http://localhost:8001/all-ebooks'); // Adjust the URL based on your backend
        if (!response.ok) {
          throw new Error('Failed to fetch eBooks.');
        }
        const data = await response.json();
        setEBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEBooks();
  }, []);

  const handleComponent = (value) => {
    setSelectedOption(value); // Update the selected option in state
    router.push(`/component/library/clglibrary/admins/${value}`); // Navigate to the respective page
  };
  useEffect(() => {
    const currentPath = router.pathname.split('/').pop(); // Get the last part of the path
    setSelectedOption(currentPath);
  }, [router.pathname]);

  // Render the component
  return (
    <Layout>
    <div className={styles.container}>
      <h1 className={styles.title}>Uploaded eBooks</h1>
      {loading && <p>Loading eBooks...</p>}
      {error && <p className={styles.error}>{error}</p>}
      <div style={{ margin: '10px 0' }}>
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
      </div>

      <div className={styles.booksRow}>
  {!loading && !error && ebooks.length === 0 }
  {!loading && !error && ebooks.length > 0 ? (
    ebooks.map((ebook) => (
      <div key={ebook._id} className={styles.bookCard}>
        <Image
          src={ebook.coverImage || '/logo.jpg'} // Placeholder image if no cover image is available
          alt={ebook.title}
          className={styles.bookImage}
        />
        <h2 className={styles.bookTitle}>{ebook.title}</h2>
        <p className={styles.bookAuthor}>by {ebook.author}</p>
        <p className={styles.bookCategory}>Category: {ebook.category}</p>
        <p className={styles.bookPrice}>
          Price: {ebook.price === 0 ? 'Free' : `$${ebook.price}`}
        </p>
        {/* Check file type and render accordingly */}
        <a
          href={`http://localhost:8001/${ebook.file}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ color: 'blue' }}
        >
          {ebook.file.endsWith('.pdf') && <span>📄 View PDF</span>}
          {ebook.file.endsWith('.doc') || ebook.file.endsWith('.docx') && <span>📝 View Word Document</span>}
          {ebook.file.endsWith('.jpg') || ebook.file.endsWith('.png') && <span>🖼️ View Image</span>}
          {!ebook.file.endsWith('.pdf') && 
           !ebook.file.endsWith('.doc') && 
           !ebook.file.endsWith('.docx') && 
           !ebook.file.endsWith('.jpg') && 
           !ebook.file.endsWith('.png') && 
           <span>📂 Open File</span>}
        </a>
      </div>
    ))
  ) : (
    <p>No eBooks available</p>
  )}
</div>

    </div>
    </Layout>
  );
}


