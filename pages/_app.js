import "bootstrap/dist/css/bootstrap.min.css";
import '../styles/globals.css'
import Navbar from './components/Navbar'
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  // https://blog.logrocket.com/handling-bootstrap-integration-next-js/
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
      }, []);

  return(
    <> 
    <div className="wrapper" style={{ 
      backgroundImage: `url('/covid.jpg')`,  
      backgroundSize: 'cover',  backgroundRepeat:'no-repeat', height : "100vh" }}>
      <Navbar />
      <Component {...pageProps} />
      </div>
  </>);
}

export default MyApp
