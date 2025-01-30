import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import {jwtDecode} from 'jwt-decode'; // Correct import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState({});
  const [profile, setProfile] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [query, setQuery] = useState(""); // Search query
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null); // To handle errors
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  // Check for token in localStorage on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the token
        setAuthUser(decoded);
        setIsAuthenticated(true);
      } catch (err) {
        console.log('Invalid token');
        setIsAuthenticated(false);
      }
    }
  }, []);
  // console.log(authUser)

  const signOut = () => {
    localStorage.removeItem('token');
    setAuthUser({});
    setProfileId(null);
    setIsAuthenticated(false);
    router.push('/auth/librarysignin');
  };

  useEffect(() => {
    const fetchUserProfileId = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${backendUrl}/get-user-profile`, {
            method: 'GET',
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          if (response.status === 200) {
            setProfileId(data.profile._id);
          } else {
            setError('Failed to fetch profile');
          }
        } catch (err) {
          setError('Error fetching profileId');
          console.error('Error fetching profileId:', err);
        }
      }
    };
    
    fetchUserProfileId();
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated, 
      setIsAuthenticated, 
      signOut, 
      setAuthUser, 
      authUser, 
      profile,
      setProfile,
      profileId, 
      setProfileId, 
      query, 
      setQuery, 
      results, 
      setResults,
      error // Add error to context to show any fetch errors
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; // Added default export here
