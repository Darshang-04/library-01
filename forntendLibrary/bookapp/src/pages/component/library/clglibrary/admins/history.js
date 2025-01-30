import { useEffect, useState } from 'react';
import AdminLayout from './layout';
import styles from '@/styles/adminhistory.module.css';

export default function History() {
  const [historyData, setHistoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Filtered data for search
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  useEffect(() => {
    // Fetch history data from the API
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${backendUrl}/admin-history`); // Adjust API endpoint as per your backend
        if (!response.ok) {
          throw new Error('Failed to fetch history records.');
        }
        const data = await response.json();
        setHistoryData(data.history);
        setFilteredData(data.history); // Initialize filtered data
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const onSearch = () => {
    const query = searchQuery.toLowerCase();
    const filtered = historyData.filter((record) =>
      record.user.firstName.toLowerCase().includes(query) ||
      record.user.lastName.toLowerCase().includes(query) ||
      record.book.TITLE.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className={styles.history_container}>
      <h1 className={styles.history_title}>Admin History</h1>
      <div>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e)=> e.key==='Enter' && onSearch()}
          style={{ backgroundColor: "white", color: "black", margin: "10px 0" }}
        />
        <button onClick={onSearch}>Search</button>
      </div>
      {filteredData.length === 0 ? (
        <p className={styles.no_records}>No history records found.</p>
      ) : (
        <table className={styles.history_table}>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Book Name</th>
              <th>Borrowed Date</th>
              <th>Due Date</th>
              <th>Returned Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((record) => (
              <tr key={record._id}>
                <td>{record.user.firstName} {record.user.lastName}</td>
                <td>{record.book.TITLE}</td>
                <td>{new Date(record.borrowedDate).toLocaleDateString()}</td>
                <td>{new Date(record.dueDate).toLocaleDateString()}</td>
                <td>{new Date(record.returnedDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

History.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
