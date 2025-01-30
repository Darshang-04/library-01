import { useState, useEffect, useContext } from 'react';
import Userlayout from '../../../../../u_layout';
import { AuthContext } from '@/pages/component/context/authcontext';
import { useRouter } from 'next/router';

Notification.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>;
};

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const { profileId } = useContext(AuthContext); // Getting profileId from AuthContext
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!profileId || profileId === "null") {
        console.log('Profile ID is not available yet or is invalid');
        return; // Prevent making an API call
      }
      try {
        const response = await fetch(`${backendUrl}/notifications/${profileId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch notifications: ${response.statusText}`);
        }

        const data = await response.json();
        setNotifications(data.notifications);
        // console.log('Fetched Notifications:', data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [profileId]); // Runs whenever profileId updates

  const handleNotificationClick = (notificationId) => {
    router.push(`/component/library/clglibrary/users/notificationDetail?id=${notificationId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'Date not available';
    }

    try {
      const options = { hour: '2-digit', minute: '2-digit' };
      return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return (
    <div>
      <h2 style={{margin: '0 10px'}}>Notification</h2>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul>
          {notifications.map((notif) => (
            <div key={notif._id} onClick={() => handleNotificationClick(notif._id)} style={{ cursor: 'pointer', margin: '10px', cursor:'pointer', backgroundColor:notif.read? 'transparent': 'gray' }}>
              <li><strong>{notif.title}</strong></li>
              <li>{notif.message}</li>
              <li><small>{formatDate(notif.timestamp)}</small></li>
              <hr />
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}
