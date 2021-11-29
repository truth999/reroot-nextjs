import "bootstrap/scss/bootstrap.scss";
import "../styles/globals.scss";

import { useEffect, useState } from "react";
import AppContext from "../contexts/AppContext";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);

  const [data, setData] = useState({
    factors: [],
    params: {},
    countries: [],
    languages: [],
  });

  return (
    <AppContext.Provider value={{ data, setData }}>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default MyApp;
