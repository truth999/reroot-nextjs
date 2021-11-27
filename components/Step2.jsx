import { useState, useContext } from "react";

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
        <section className="select-language">
          <div className="search-title">
            Great! You said language. Which languages?
          </div>
          <div className="search-bar">
            <input
              type="text"
              className="search-languages"
              placeholder="Search Language"
              value={queryLanguage}
              onChange={(event) => updateQueryLanguage(event.target.value)}
            />
          </div>
          <div className="search-results">
            <p>{queryLanguage}</p>
            {showingLanguages.map((lang) => {
              const id = `language-${lang.id}`;
              return (
                <div className="form-check" key={id}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="language"
                    value={lang.name}
                    id={id}
                  />
                  <label className="form-check-label" htmlFor={id}>
                    {lang.native}
                  </label>
                </div>
              );
            })}
          </div>
        </section>
      )}
      {props.askCountry && (
        <section className="select-country">
          <div className="search-title">
            You also said nativeland. What countries?
          </div>
          <div className="search-bar">
            <input
              type="text"
              className="search-country"
              placeholder="Search Country"
              value={queryCountry}
              onChange={(event) => updateQueryCountry(event.target.value)}
            />
          </div>
          <div className="search-results">
            <p>{queryCountry}</p>
            {showingCountries.map((country) => {
              const id = `language-${country.id}`;
              return (
                <div className="form-check" key={id}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="country"
                    value={country.name}
                    id={id}
                  />
                  <label className="form-check-label" htmlFor={id}>
                    {country.name}
                  </label>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </section>
  );
}
