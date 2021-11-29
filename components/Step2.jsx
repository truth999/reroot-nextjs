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
  let languages = community.sub.filter((s) => s.name == "language")[0].sub;
  const countries = community.sub.filter((s) => s.name == "origin")[0].sub;

  data.languages = languages;
  data.countries = countries;
  setData(data);

  if (props.currentStep !== 2) {
    // Prop: The current step
    return null;
  }

  const updateQueryLanguage = (query) => {
    setQueryLanguage(query);
  };

  console.log();

  const showingLanguages =
    queryLanguage.trim() == ""
      ? languages.slice(0, 6)
      : languages.filter((lang) =>
          lang.name.toLowerCase().includes(queryLanguage.toLowerCase())
        );

  const updateQueryCountry = (query) => {
    setQueryCountry(query);
  };

  const showingCountries =
    queryCountry.trim() === ""
      ? countries.slice(0, 6)
      : countries.filter((country) =>
          country.name.toLowerCase().includes(queryCountry.toLowerCase())
        );

  return (
    <section className="step-2">
      {props.askLanguage && (
        <section className="select-language pb-">
          <div className={`pb-2`}>
            <p className={`${styles.title}`}>Great! You said language.</p>
            <p className={`${styles.subtitle}`}>Which languages?</p>
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
                const id = `language-${lang.name}`;
                return (
                  <div className="col-lg-2 py-2" key={id}>
                    <SubFactor
                      id={id}
                      value={lang.name}
                      param={lang.param}
                      name="language"
                      onClick={props.handleClick}
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
          <div className={`pb-2`}>
            <p className={`${styles.title}`}>You also said nativeland.</p>
            <p className={`${styles.subtitle}`}>Which country?</p>
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
                const id = `country-${country.name}`;
                return (
                  <div className="col-lg-2 py-2" key={id}>
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
