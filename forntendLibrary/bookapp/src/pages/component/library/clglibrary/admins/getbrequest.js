import AdminLayout from "./layout";
import { useState, useEffect } from "react";
import styles from '@/styles/AdminBorrowRequests.module.css';

export default function AdminBorrowRequests() {
  const [requests, setRequests] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [showRequests, setShowRequests] = useState(true);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`${backendUrl}/borrow-requests/pending`);
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error("Failed to fetch borrow requests:", error);
      }
    };

    const fetchWaitlist = async () => {
      try {
        const response = await fetch(`${backendUrl}/get-waitlist`);
        const data = await response.json();
        setWaitlist(data);
      } catch (error) {
        console.error("Failed to fetch waitlist:", error);
      }
    };

    const markRequestsViewed = async () => {
      try {
        await fetch(`${backendUrl}/borrow-requests/mark-viewed`, { method: "POST" });
        setPendingRequestsCount(0);
      } catch (error) {
        console.error("Error marking requests as viewed:", error);
      }
    };

    fetchRequests();
    fetchWaitlist();
    markRequestsViewed();
  }, []);

  const handleRequestAction = async (requestId, action) => {
    try {
      const response = await fetch(`${backendUrl}/user-borrow/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      });
      const data = await response.json();
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
      alert(data.message);
    } catch (error) {
      console.error(`Error handling request ${action}:`, error);
    }
  };

  const onSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredRequests = requests.filter(
    (request) =>
      request.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.book.TITLE.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredWaitlist = waitlist.filter(
    (item) =>
      item.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.book.TITLE.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout pendingRequestsCount={pendingRequestsCount}>
      <div className={styles.adminContainer}>
        <h2 className={styles.adminTitle}>Manage Borrow Requests and Waitlist</h2>

        <div className={styles.toggleButtons}>
          <button
            className={`${styles.toggleButton} ${showRequests ? styles.active : ""}`}
            onClick={() => setShowRequests(true)}
          >
            Borrow Requests
          </button>
          <button
            className={`${styles.toggleButton} ${!showRequests ? styles.active : ""}`}
            onClick={() => setShowRequests(false)}
          >
            Waitlist
          </button>
        </div>

        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by user, email, or book title"
          value={searchQuery}
          onChange={onSearchChange}
        />

        {showRequests ? (
          <div className={styles.requestsContainer}>
            <h3 className={styles.sectionTitle}>Pending Borrow Requests</h3>
            <ul className={styles.requestsList}>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <li key={request._id} className={styles.requestItem}>
                    <p>
                      <strong>User:</strong> {request.user.firstName} ({request.user.email})
                    </p>
                    <p>
                      <strong>Book:</strong> {request.book.TITLE}
                    </p>
                    <div className={styles.actionButtons}>
                      <button
                        className={`${styles.actionButton} ${styles.approve}`}
                        onClick={() => handleRequestAction(request._id, "approve")}
                      >
                        Approve
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.reject}`}
                        onClick={() => handleRequestAction(request._id, "reject")}
                      >
                        Reject
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <p>No matching borrow requests found.</p>
              )}
            </ul>
          </div>
        ) : (
          <div className={styles.waitlistContainer}>
            <h3 className={styles.sectionTitle}>Waitlist</h3>
            <ul className={styles.waitlistList}>
              {filteredWaitlist.length > 0 ? (
                filteredWaitlist.map((item) => (
                  <li key={item._id} className={styles.waitlistItem}>
                    <p>
                      <strong>User:</strong> {item.user.firstName} ({item.user.email})
                    </p>
                    <p>
                      <strong>Book:</strong> {item.book.TITLE}
                    </p>
                    <p>
                      <strong>Requested Date:</strong> {new Date(item.requestedAt).toLocaleDateString()}
                    </p>
                    <div className={styles.actionButtons}>
                      <button
                        className={`${styles.actionButton} ${styles.approve}`}
                        onClick={() => handleRequestAction(item._id, "approve")}
                      >
                        Approve
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.reject}`}
                        onClick={() => handleRequestAction(item._id, "reject")}
                      >
                        Reject
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <p>No matching waitlist items found.</p>
              )}
            </ul>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
