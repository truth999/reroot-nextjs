import React, { useState } from "react";

import Factor from "./factor";
import styles from "./Step.module.scss";
import Row from "react-bootstrap/Row";

export default function Step3({
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
  // Country
  const [queryCountry, setQueryCountry] = useState("");

  if (currentStep !== 3) {
    // Prop: The current step
    return null;
  }

  const updateQueryCountry = (query) => {
    setQueryCountry(query);
  };

  const showingCountries =
    queryCountry.trim() === ""
      ? []
      : countries.filter((country) =>
          country.name.toLowerCase().includes(queryCountry.toLowerCase())
        );

  return (
    <section className="step-3">
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
    </section>
  );
}
