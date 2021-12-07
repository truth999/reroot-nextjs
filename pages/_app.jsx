import { createTheme, ThemeProvider } from "@mui/material/styles";

import "../styles/custom.scss";
import "../styles/globals.scss";

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
    countries: [],
    languages: [],
    parameters: {},
    selectedCountries: [],
    selectedLanguages: [],
    theme: theme,
  });

  const [favorites, setFavorites] = useState([]);

  return (
    <AppContext.Provider value={{ data, setData, favorites, setFavorites }}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default MyApp;
