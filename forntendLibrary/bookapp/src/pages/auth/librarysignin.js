import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/auth.module.css';
import Link from 'next/link';
import { AuthContext } from '../component/context/authcontext';


export default function LibrarySignin({ initialError }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(initialError || '');
  const [success, setSuccess] = useState('');
  const { setProfile } = useContext(AuthContext);
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${backendUrl}/auth/signin-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.status === 200) {
        const { token, role } = data;

        // Save the token in localStorage
        localStorage.setItem('token', token);

        // Route based on user role
        if (role === 'user') {
          // console.log(data.profile)
          setSuccess(data.msg);
          setProfile(data.profile)
          router.push("/component/library/clglibrary/users/home");
        } else if (role === 'admin') {
          setSuccess(data.msg);
          router.push("/component/library/clglibrary/admins/home");
        } else {
          setError("Invalid role.");
        }
      } else {
        setError(data.err || "Signin failed");
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className={styles.libsign}>
    <div className={styles.container}>
      <div className={styles.form_container}>
      <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.h1}>Sign In</h1>
      <Link className={styles.link} href={"/component/library/publiclibrary/publiclibrary"}>Or skip to public library ...</Link>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

      <div className={styles.element}>
        <div className={styles.element1}>
          <label className={styles.title}></label>
          <input
            className={styles.input}
            placeholder='Member Number'
            type="text"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.element2}>
          <label className={styles.title}></label>
          <input
            className={styles.input}
            placeholder='Password'
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        </div>
        <p className={styles.forp}>
        <a href="#" onClick={() => router.push('/component/library/clglibrary/users/forgetpass')}>
          Forgot Password?
        </a>
      </p>
        <button className={styles.button} type="submit">Sign In</button>
        </form>
        </div>

        <div className={styles.toggle_container}>
          <div className={styles.toggle}>
            <div className={styles.toggle_pannel}>
          <h1>Welcome Back!</h1>
          <p>Enter your personal details to use all of library features</p>
      </div>
      </div>
      </div>
      
    </div>
    </div>
  );
}

// Server-side function to provide initial error if needed
export async function getServerSideProps(context) {
  return {
    props: {
      initialError: '', // Pass any initial error messages or other data as props
    },
  };
}
