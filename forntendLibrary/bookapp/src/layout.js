import Link from "next/link";
import Image from "next/image";
import styles from "./styles/layout.module.css"
import Home from "./pages";
import { useRouter } from "next/navigation";

export default function Layout({ children }){
    // const router = useRouter();
    // const navigate = (pathname) => {
    //     return() => {
    //         router.push(pathname);
    //     }
    // };
    return(
        <>
        <header className={styles.header}>
          <nav className={styles.navbar}>
            <Image className={styles.logoImage} src = "/logo.jpg" alt = "Logo" height={50} width={50}/>
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <Link href="/">Home</Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/component/login">Login</Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/component/about">About</Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/auth/librarysignin">Library</Link>
              </li>
              <li className={styles.navItem}>
                <Link href="https://posts-sigma-eight.vercel.app">UserExchange</Link>
              </li>
            </ul>
            {/* <a onClick={navigate("/")}>Home</a>
            <br></br>
            <a onClick={navigate("/login")}>Login</a>
            <br></br>
            <a onClick={navigate("/about")}>About</a> */}
          </nav>
        </header>
      <main className={styles.main}>{children}</main>
      </>
        
    )
}
