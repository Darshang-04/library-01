import { useState, useEffect } from "react"
import Userlayout from "../../../../../u_layout"

ForgotPassword.getLayout = function getLayout(page) {
    return <Userlayout>{page}</Userlayout>;
  };

  export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('http://localhost:8001/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
  
        const data = await response.json();
        if (response.ok) {
          setMessage('Password reset link sent to your email');
        } else {
          setMessage(data.error || 'Something went wrong');
        }
      } catch (error) {
        setMessage('Server error. Please try again later.');
      }
    };
  
    return (
      <div>
        <h1>Forgot Password</h1>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">Send Reset Link</button>
        </form>
      </div>
    );
  }
  
