import "@/styles/globals.css";
import { AuthProvider } from "./component/context/authcontext";
// import { SearchProvider } from "./component/context/searchcontext";

export default function App({ Component, pageProps }) {
  // Check if the page has a custom layout. If not, use a default layout.
  const getLayout = Component.getLayout || ((page) => page);
  

  return getLayout(
  <AuthProvider>
    <Component {...pageProps} />
  </AuthProvider>
    );
}
