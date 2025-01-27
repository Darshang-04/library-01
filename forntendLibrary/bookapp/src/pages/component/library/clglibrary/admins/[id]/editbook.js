import React from 'react'
import AdminLayout from '../layout';
import styles from '@/styles/bookform.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

Editbook.getLayout = function getLayout(page) { 
    return <AdminLayout>{page}</AdminLayout>; 
  };

export default function Editbook() {
  const router = useRouter();
  const [success, setSuccess] = useState('')  
  const [error, setError] = useState('')  
  const { id } = router.query;
  const [bookdetails, setBookdetails] = useState({
    CAT_NO:'',
    AUTH_ID1:'',
    TITLE: '',
    PLACE_OF_PUB: '',
    SUB_ID: '',
    PHOTO: '',
  });

  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchBookDetails = async () => {
      try {
        const res = await fetch(`http://localhost:8001/book/${id}`);
        const data = await res.json();

        if (res.status === 200) {
          setBookdetails(data.book);
        } else {
          console.error(data.message || "Failed to fetch book details");
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBookDetails();
  }, [router.isReady, id]);

  const handleFileChange = (e) => {
    setBookdetails({ ...bookdetails, PHOTO: e.target.files[0] });
  };

  const uploadImage = async () => {
    if (!bookdetails.PHOTO) return null;

    const imageFormData = new FormData();
    imageFormData.append('file', bookdetails.PHOTO);
    imageFormData.append('upload_preset', 'anime_reels'); // Replace with your Cloudinary preset

    const res = await fetch('https://api.cloudinary.com/v1_1/okcloud/image/upload', {
      method: 'POST',
      body: imageFormData,
    });

    const data = await res.json();
    return data.secure_url; // Return the Cloudinary URL
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const photoUrl = await uploadImage();
    
    const updatedBook = {
      CAT_NO: bookdetails.CAT_NO,
      TITLE: bookdetails.TITLE,
      AUTH_ID1: bookdetails.AUTH_ID1,
      PLACE_OF_PUB: bookdetails.PLACE_OF_PUB,
      SUB_ID: bookdetails.SUB_ID,
      PHOTO: photoUrl || bookdetails.PHOTO,  // Use uploaded photo URL if exists
    };
  
    try {
      const res = await fetch(`http://localhost:8001/update-book/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBook),
      });
  
      const data = await res.json(); // Make sure to await this to get the actual data
  
      if (res.status === 200) {
        console.log(data.book);  // This will give you the updated book object
        setSuccess("Book updated successfully!");
        router.replace(`/component/library/clglibrary/admins/${id}/bookdetails`);
      } else {
        console.error('Failed to update book details');
        setError("Failed to update book details");  // Optional: show error message
      }
    } catch (error) {
      console.error('Error updating book details:', error);
      setError("Error updating book details");  // Optional: show error message
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookdetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add Books</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        {success && <p style={{ color:'green'}}>{success}</p>}
        {error && <p style={{ color:'red'}}>{error}</p>}
        <label className={styles.label}>
          CAT_NO:
          <input
            className={styles.input}
            type="text"
            name="CAT_NO"
            value={bookdetails.CAT_NO}
            onChange={handleInputChange}
            required
          />
        </label>

        <label className={styles.label}>
        TITLE:
          <input
            className={styles.input}
            type="text"
            name="TITLE"
            value={bookdetails.TITLE}
            onChange={handleInputChange}
            required
          />
        </label>

        <label className={styles.label}>
        AUTH_ID1:
          <input
            className={styles.input}
            type="text"
            name="AUTH_ID1"
            value={bookdetails.AUTH_ID1}
            onChange={handleInputChange}
            required
          />
        </label>

        <label className={styles.label}>
        PLACE_OF_PUB:
          <input
            className={styles.input}
            type="text"
            name="PLACE_OF_PUB"
            value={bookdetails.PLACE_OF_PUB}
            onChange={handleInputChange}
            min="1"
            required
          />
        </label>
        <label className={styles.label}>
        SUB_ID:
          <input
            className={styles.input}
            type="text"
            name="SUB_ID"
            value={bookdetails.SUB_ID}
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
            name="PHOTO"
            onChange={handleFileChange}
          />
        </label>

        <button className={styles.button} type="submit">Add Book</button>
      </form>
    </div>
  )
}
