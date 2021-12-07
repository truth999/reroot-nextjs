import { createTheme, ThemeProvider } from "@mui/material/styles";

import "../styles/custom.scss";
import "../styles/globals.scss";

import { useEffect, useState } from "react";
import AppContext from "../contexts/AppContext";
import { UserProvider } from "@auth0/nextjs-auth0";

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

  return (
    <UserProvider>
      <AppContext.Provider value={{ data, setData }}>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </AppContext.Provider>
    </UserProvider>
  );
}

export default MyApp;
