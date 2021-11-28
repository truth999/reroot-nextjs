import { useState, useContext } from "react";
import styles from "./Step.module.scss";
import SubFactor from "../components/SubFactor";

const languages = [
  { id: 1, name: "Spanish", native: "Español" },
  { id: 2, name: "Chinese", native: "中文" },
  { id: 3, name: "Russian", native: "Русский" },
  { id: 4, name: "French", native: "Français" },
  { id: 5, name: "Korean", native: "한국어" },
  { id: 6, name: "Italian", native: "Italiano" },
  { id: 7, name: "Vietnamese", native: "Tiếng Việt" },
];

const countries = [
  { id: 1, name: "Mexico" },
  { id: 2, name: "China" },
  { id: 3, name: "Russia" },
  { id: 4, name: "France" },
  { id: 5, name: "Korea" },
  { id: 6, name: "Italy" },
  { id: 7, name: "Vietnam" },
];

export default function Step2(props) {
  // Language
  const [queryLanguage, setQueryLanguage] = useState("");
  // Country
  const [queryCountry, setQueryCountry] = useState("");

  if (props.currentStep !== 2) {
    // Prop: The current step
    return null;
  }

  const updateQueryLanguage = (query) => {
    setQueryLanguage(query);
  };

  const showingLanguages =
    queryLanguage === ""
      ? languages
      : languages.filter((lang) =>
          lang.name.toLowerCase().includes(queryLanguage.toLowerCase())
        );

  const updateQueryCountry = (query) => {
    setQueryCountry(query);
  };

  const showingCountries =
    queryCountry === ""
      ? countries
      : countries.filter((country) =>
          country.name.toLowerCase().includes(queryCountry.toLowerCase())
        );

  return (
    <section className="step-2">
      {props.askLanguage && (
        <section className="select-language pb-4">
          <div className={`${styles.title} pb-2`}>
            Great! You said language. Which languages?
          </div>
          <div className="search-bar">
            <input
              type="text"
              className={styles.search}
              placeholder="Search Language"
              value={queryLanguage}
              onChange={(event) => updateQueryLanguage(event.target.value)}
            />
          </div>
          <div className="search-results">
            <div className="row pt-3">
              {showingLanguages.map((lang) => {
                const id = `language-${lang.id}`;
                return (
                  <div className="col-lg-2 py-2 me-2" key={id}>
                    <SubFactor id={id} value={lang.name} name="language">
                      {lang.native}
                    </SubFactor>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
      {props.askCountry && (
        <section className="select-country pb-4">
          <div className={`${styles.title} pb-2`}>
            You also said nativeland. What countries?
          </div>
          <div className="search-bar">
            <input
              type="text"
              className={styles.search}
              placeholder="Search Country"
              value={queryCountry}
              onChange={(event) => updateQueryCountry(event.target.value)}
            />
          </div>
          <div className="search-results">
            <div className="row pt-3">
              {showingCountries.map((country) => {
                const id = `country-${country.id}`;
                return (
                  <div className="col-lg-2 col-xl-1 py-2 me-2" key={id}>
                    <SubFactor id={id} value={country.name} name="country">
                      {country.name}
                    </SubFactor>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </section>
  );
}
