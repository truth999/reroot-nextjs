import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useEffect, useState } from "react";
import AppContext from "../contexts/AppContext";
import { UserProvider } from "@auth0/nextjs-auth0";

import "../styles/globals.scss";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);

  const theme = createTheme({
    palette: {
      primary: {
        light: "#f29c70",
        main: "#db3c21",
        dark: "#e7654b",
        contrastText: "#fff7ec",
      },
      secondary: {
        main: "#ba4d3a",
        light: "#0141b3",
        dark: "#fff7ec",
        contrastText: "#fff7ec",
      },
      blank: {
        main: "#0f1c4d",
        light: "#898383",
        dark: "#c4c4c4",
        contrastText: "#e5e5e5",
      },
    },
  });

  const [data, setData] = useState({
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
