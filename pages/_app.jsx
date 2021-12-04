import Router from "next/router";
import NProgress from "nprogress";
import "bootstrap/scss/bootstrap.scss";
import "nprogress/nprogress.css";
import "../styles/globals.scss";

NProgress.configure({
  minimum: 0.3,
  easing: "ease",
  speed: 800,
  showSpinner: false,
});

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

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
