import React, { useState, useEffect, useMemo, useCallback } from "react";

import Factor from "../components/factor";
import styles from "./Step.module.scss";
import Row from "react-bootstrap/Row";
import debounce from "lodash.debounce";

export default function Step2({
  handleChange,
  currentStep,
  languages,
  countries,
  askLanguage,
  askCountry,
  selectedLanguages,
  setSelectedLanguages,
  selectedCountries,
  setSelectedCountries,
}) {
  // Language
  const [queryLanguage, setQueryLanguage] = useState("");
  const languageChangeHandler = (event) => setQueryLanguage(event.target.value);
  const debouncedLanguageChangeHandler = useCallback(() => {
    debounce(languageChangeHandler, 300);
  }, []);

  const showingLanguages =
    queryLanguage.trim() == ""
      ? []
      : languages.filter((lang) =>
          lang.name.toLowerCase().includes(queryLanguage.toLowerCase())
        );

  // Country
  const [queryCountry, setQueryCountry] = useState("");
  const updateQueryCountry = (query) => {
    setQueryCountry(query);
  };

  const showingCountries =
    queryCountry.trim() === ""
      ? []
      : countries.filter((country) =>
          country.name.toLowerCase().includes(queryCountry.toLowerCase())
        );

  if (currentStep !== 2) {
    // Prop: The current step
    return null;
  }

  return (
    <section className="step-2">
      {askLanguage && (
        <section className="select-language pb-4">
          <div className={`pb-2`}>
            <p className={`${styles.title}`}>Great! You said language.</p>
            <p className={`${styles.subtitle}`}>Which languages?</p>
          </div>
          <div className="search-bar">
            <input
              onChange={languageChangeHandler}
              type="text"
              className={styles.search}
              placeholder="Search Language"
              value={queryLanguage}
            />
          </div>
          <Row className={`${styles.searchResults} py-3`}>
            {showingLanguages.map((lang) => {
              const id = `language-${lang.id}`;
              return (
                <Factor
                  key={id}
                  id={id}
                  value={lang.id}
                  parameter={lang.parameterId}
                  name="language"
                  selectedFactors={selectedLanguages}
                  setSelectedFactors={setSelectedLanguages}
                  handleChange={handleChange}
                  asks={{ askLanguage, askCountry }}
                >
                  {lang.text}
                </Factor>
              );
            })}
          </Row>
        </section>
      )}
      {askCountry && (
        <section className="select-country pb-4">
          <div className={`pb-2`}>
            <p className={`${styles.title}`}>You also said nativeland.</p>
            <p className={`${styles.subtitle}`}>Which countries?</p>
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
          <Row className={`${styles.searchResults} py-3`}>
            {showingCountries.map((country) => {
              const id = `country-${country.id}`;
              return (
                <Factor
                  key={id}
                  id={id}
                  value={country.id}
                  name="country"
                  country={country}
                  parameter={country.parameterId}
                  selectedFactors={selectedCountries}
                  setSelectedFactors={setSelectedCountries}
                  handleChange={handleChange}
                  asks={{ askLanguage, askCountry }}
                >
                  {country.text}
                </Factor>
              );
            })}
          </Row>
        </section>
      )}
    </section>
  );
}
