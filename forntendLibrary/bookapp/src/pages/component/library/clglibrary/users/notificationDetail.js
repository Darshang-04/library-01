import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Userlayout from '../../../../../u_layout';
import Image from 'next/image';

NotificationDetails.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>;
};

export default function NotificationDetails() {
  const router = useRouter();
  const { id } = router.query; // Get the notification ID from the query
  const [notification, setNotification] = useState(null);
  const defaultImage = 'https://th.bing.com/th/id/OIP.3J5xifaktO5AjxKJFHH7oAAAAA?rs=1&pid=ImgDetMain';

  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchNotificationDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8001/notifications/details/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch notification details: ${response.statusText}`);
        }

        const data = await response.json();
        setNotification(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching notification details:', error);
      }
    };

    fetchNotificationDetails();
  }, [id]);

  if (!id) {
    return <p>Loading notification id...</p>;
  }

  if (!notification) {
    return <p>Loading notification details...</p>;
  }

  return (
    <div>
      <h2>Notification Details</h2>
      {/* Title */}
      <p><strong>Title:</strong> {notification.detailedNotification?.title || 'N/A'}</p>

      {/* Book Image */}
      <Image
        src={
          isValidURL(notification.detailedNotification?.book?.PHOTO) &&
          notification.detailedNotification?.book?.PHOTO !== 'NULL'
            ? notification.detailedNotification.book.PHOTO
            : defaultImage
        }
        alt={notification.detailedNotification?.book?.TITLE || 'Book Image'}
        width={150}
        height={150}
      />

      {/* Message */}
      <p><strong>Message:</strong> {notification.detailedNotification?.message || 'N/A'}</p>

      {/* Book Details */}
      <p><strong>Book Title:</strong> {notification.detailedNotification?.book?.TITLE || 'N/A'}</p>
      <p><strong>Author:</strong> {notification.author || 'N/A'}</p>

      {/* User Details */}
      <p>
        <strong>User:</strong>{' '}
        {notification.detailedNotification.user?.firstName || 'N/A'} {notification.detailedNotification.user?.lastName || 'N/A'}
      </p>

      {/* Return Date and Penalty */}
      <p>
        <strong>Return Date:</strong>{' '}
        {notification.detailedNotification.user.userId ? new Date(notification.detailedNotification.user.userId).toLocaleString() : 'N/A'}
      </p>
      <p><strong>Penalty:</strong> {notification.detailedNotification.user.penalty || 'None'}</p>
    </div>
  );
}
