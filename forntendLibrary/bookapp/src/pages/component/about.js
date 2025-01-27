import Layout from "../../layout";
import styles from '@/styles/about.module.css';
import Head from 'next/head';

export default function About() {
  return (
    <Layout>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      />


     <div className={styles.container}>
      <div className={styles.top}>
        <video className={styles.backgroundVideo} autoPlay muted loop>
            <source src="/background/mainbg.mp4" type="video/mp4" />
               Your browser does not support the video tag.
        </video>
        <h1>About Us</h1>
        </div>

        <div className={styles.second}>
          <div className={styles.workpic}></div>
          <div className={styles.side_part1}>
            <h1>We Always Make The Best</h1>
            <p>We are committed to revolutionizing library management by offering seamless and efficient solutions. Our platform simplifies book tracking, borrowing, and inventory management, ensuring libraries run at their best for both staff and users.</p>
            <button>Contact Us</button>
          </div>
        </div>



        <div className={styles.third}>
          <div className={styles.books}>
            <h1>Our books</h1>
            <p>Our collection spans a wide range of genres, from timeless classics to modern bestsellers, ensuring there something for every reader. Meticulously organized and easily accessible, our books are curated to inspire, educate, and entertain.</p>
          </div>


          <div className={styles.achievements}>

            <div className={styles.part1}>
              <div className={styles.one}>
              <h1>4+</h1>
              <p>Years Of Experience</p>
              </div>
              <div className={styles.two}>
              <h1>4+</h1>
              <p>Satisfied Client</p>
              </div>
            </div>

            <div className={styles.part2}>
              <div className={styles.three}>
              <h1>4+</h1>
              <p>Project Done</p>
              </div>
              <div className={styles.four}>
              <h1>4+</h1>
              <p>Certified Award</p>
              </div>
            </div>
          </div>
        </div>

      <div className={styles.fourth}>
        <div className={styles.joinus}>
          <p>Join Us Now</p>
          <h1>We Are Always Ready To Take A Perfect Shot</h1>
          <button>Get Started</button>
        </div>
        </div>

        
        <div className={styles.contact}>
          <div className={styles.visit}>
          <i className="fas fa-home"></i>
            <h2>VISIT US</h2>
            <p>We’d love to see you! Visit us at our location and let’s connect.</p>
            <h4>Chembur, Mumbai</h4>
          </div>

          <div className={styles.call}>
          <i className="fas fa-phone"></i>
            <h2>CALL US</h2>
            <p>Have questions? Call us anytime—we’re here to help!</p>
            <h4>9876543210</h4>
          </div>

          <div className={styles.email}>
          <i className="fas fa-envelope"></i>
            <h2>EMAIL US</h2>
            <p>Email us for inquiries, and we’ll respond promptly to assist you.</p>
            <h4>abcd@gmail.com</h4>
          </div>
        </div>
        </div>
    </Layout>
  );
}
