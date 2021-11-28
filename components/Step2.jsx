import { useState, useContext } from "react";
import styles from "./Step.module.scss";
import SubFactor from "../components/SubFactor";
import AppContext from "../contexts/AppContext";

export default function Step2(props) {
  // Language
  const [queryLanguage, setQueryLanguage] = useState("");
  // Country
  const [queryCountry, setQueryCountry] = useState("");

  const { data, setData } = useContext(AppContext);

  const community = data.factors.filter(
    (factor) => factor.name == "community"
  )[0];
  const languages = community.sub.filter((s) => s.name == "language")[0].sub;
  const countries = community.sub.filter((s) => s.name == "origin")[0].sub;

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
              {showingLanguages.slice(0, 6).map((lang) => {
                const id = `language-${lang.name}`;
                return (
                  <div className="col-lg-2 col-xl-1 py-2 me-2" key={id}>
                    <SubFactor
                      id={id}
                      value={lang.name}
                      param={lang.param}
                      name="language"
                    >
                      {lang.text}
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
              {showingCountries.slice(0, 6).map((country) => {
                const id = `country-${country.name}`;
                return (
                  <div className="col-lg-2 col-xl-1 py-2 me-2" key={id}>
                    <SubFactor
                      id={id}
                      value={country.name}
                      param={country.param}
                      name="country"
                      onClick={props.handleClick}
                    >
                      {country.text}
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
