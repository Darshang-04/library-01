import Layout from "../../layout";
import Image from "next/image";
import styles from '@/styles/mHome.module.css';

export default function Home() {
  return (
    <Layout>
      <div >
        <video className={styles.backgroundVideo} autoPlay muted loop>
            <source src="/background/mainbg.mp4" type="video/mp4" />
               Your browser does not support the video tag.
        </video>
      {/* Text Overlay */}
      <div className={styles.text}>
        <h1>WELCOME TO THE BOOKSERA</h1>
        <p>Explore our collection of books and resources</p>
      </div>
    </div>
    </Layout>
  );
}
