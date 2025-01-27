import AdminLayout from './layout';
import { useState } from 'react';
import styles from '@/styles/bookform.module.css';

export default function AdminAddBook() {
  const [success, setSuccess]= useState('')
  const [error, setError]= useState('')
  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    author: '',
    quantity: '',
    stream:'',
    bookImage: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, bookImage: e.target.files[0] });
  };

  const uploadImage = async () => {
    if (!formData.bookImage) return null;

    const imageFormData = new FormData();
    imageFormData.append('file', formData.bookImage);
    imageFormData.append('upload_preset', 'anime_reels'); // Replace with your Cloudinary preset

    const res = await fetch('https://api.cloudinary.com/v1_1/okcloud/image/upload', {
      method: 'POST',
      body: imageFormData,
    });

    const data = await res.json();
    return data.secure_url; // Return the Cloudinary URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData({
    isbn: '',
    title: '',
    author: '',
    quantity: '',
    stream:'',
    bookImage: null,
    })
    setSuccess('')
    setError('')

    // Upload the image to Cloudinary and get the URL
    const photoUrl = await uploadImage();

    // Prepare data for submission
    const bookData = {
      isbn: formData.isbn,
      title: formData.title,
      author: formData.author,
      quantity: formData.quantity,
      stream: formData.stream,
      bookimage: photoUrl,
    };

    try {
      const res = await fetch('http://localhost:8001/add-books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData), // Send the specific fields
      });

      const result = await res.json();

      if (res.status === 200) {
        console.log(result.msg);
        setSuccess(result.msg)
      } else {
        console.error(result.err || "Error while saving");
        setError(result.err || "Error while saving")
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add Books</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        {success && <p style={{ color:'green'}}>{success}</p>}
        {error && <p style={{ color:'red'}}>{error}</p>}
        <label className={styles.label}>
          ISBN:
          <input
            className={styles.input}
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={handleInputChange}
            required
          />
        </label>

        <label className={styles.label}>
          Stream:
          <input
            className={styles.input}
            type="text"
            name="stream"
            value={formData.stream}
            onChange={handleInputChange}
            required
          />
        </label>
        <label className={styles.label}>
          Title:
          <input
            className={styles.input}
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </label>

        <label className={styles.label}>
          Author:
          <input
            className={styles.input}
            type="text"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            required
          />
        </label>

        <label className={styles.label}>
          Quantity Available:
          <input
            className={styles.input}
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            min="1"
            required
          />
        </label>

        <label className={styles.label}>
          Book Image:
          <input
            className={styles.input}
            accept="image/*"
            type="file"
            name="bookImage"
            onChange={handleFileChange}
          />
        </label>
        <button className={styles.button} type="submit">Add Book</button>
      </form>
    </div>
  );
}

// Use the custom layout for the page
AdminAddBook.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
