import { useState } from 'react';
import styles from '@/styles/ebookform.module.css'
import AdminLayout from './layout';

export default function UploadEBook() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    language: '',
    description: '',
    price: '',
    isbn: '',
    fileType: '',
  });

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const form = new FormData();
      form.append('file', file);
      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
      });

      const response = await fetch('http://localhost:8001/upload-ebook', {
        method: 'POST',
        body: form,
      });

      if (!response.ok) {
        throw new Error('Failed to upload eBook');
      }

      const data = await response.json();
      if(response.status === 200){
        setMessage(data.message || 'eBook uploaded successfully!');
        setFormData({
          title: '',
          author: '',
          category: '',
          language: '',
          description: '',
          price: '',
          isbn: '',
          fileType: '',
        });
        setFile(null);
        if (e.target.reset) e.target.reset();
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Upload an eBook</h1>
      {message && <p className={styles.success}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="title" className={styles.label}>Title</label>
          <input className={styles.input}
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="author" className={styles.label}>Author</label>
          <input className={styles.input}
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="category" className={styles.label}>Category</label>
          <input className={styles.input}
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="language" className={styles.label}>Language</label>
          <input className={styles.input}
            type="text"
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="description" className={styles.label}>Description</label>
          <textarea className={styles.textarea}
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className={styles.field}>
          <label htmlFor="price" className={styles.label}>Price (0 for free)</label>
          <input className={styles.input}
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="isbn" className={styles.label}>ISBN</label>
          <input className={styles.input}
            type="text"
            id="isbn"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="fileType" className={styles.label}>File Type (PDF/word)</label>
          <input className={styles.input}
            type="text"
            id="fileType"
            name="fileType"
            value={formData.fileType}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="file" className={styles.label}>Upload File</label>
          <input type="file" id="file" className={styles.input} onChange={handleFileChange} required />
        </div>
        <button type="submit" className={styles.submitButton}>
          Upload eBook
        </button>
      </form>
    </div>
  );
}

UploadEBook.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
}