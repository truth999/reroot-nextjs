import Router from "next/router";
import NProgress from "nprogress";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { purple } from "@mui/material/colors";

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

  const theme = createTheme({
    palette: {
      primary: {
        // Purple and green play nicely together.
        main: "#E7654B",
      },
      secondary: {
        // This is green.A700 as hex.
        main: "#11cb5f",
      },
    },
  });

  const [data, setData] = useState({
    factors: [],
    params: {},
    countries: [],
    languages: [],
    selectedCountry: "",
    selectedLanguage: "",
    theme: theme,
  });

  return (
    <AppContext.Provider value={{ data, setData }}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default MyApp;
