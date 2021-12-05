import React, { useState, useContext } from "react";

import AdjustButton from "../../components/adjustButton";
import ImportanceSlider from "../importanceSlider";
import ComboBox from "../../components/comboBox";

import AppContext from "../../contexts/AppContext";
import styles from "./preference.module.scss";

export default function Preference({ updateScores }) {
  // Constants
  const ON = 2;
  const { data, setData } = useContext(AppContext);
  const { selectedLanguage, selectedCountry, params, selectedParams } = data;
  const initialCountry = data.countries.find(
    (country) => country.name === selectedCountry
  );
  const initialLanguage = data.languages.find(
    (language) => language.name === selectedLanguage
  );

  const [countries, setCountries] = useState(
    initialCountry ? [initialCountry] : []
  );
  const [languages, setLanguages] = useState(
    initialLanguage ? [initialLanguage] : []
  );

  const selectedFactors = Object.entries(selectedParams).map(
    ([param, _]) => params[param].category_name
  );

  const appendCountry = (country) => {
    const newCountries = countries.map((_) => _);
    if (!newCountries.includes(country)) newCountries.push(country);
    setCountries(newCountries);
  };

  const removeCountry = (country) => {
    setCountries(countries.filter((c) => c !== country));
  };

  const removeLanguage = (language) => {
    setLanguages(languages.filter((l) => l !== language));
  };

  const appendLanguage = (language) => {
    const newLanguages = languages.map((_) => _);
    if (!newLanguages.includes(language)) newLanguages.push(language);
    setLanguages(newLanguages);
  };

  return (
    <div className="flex-shrink-0 p-1" style={{ width: "100%" }}>
      <div className="d-flex flex-column align-items-center pb-2 link-dark text-decoration-none fs-5">
        <div>
          <AdjustButton side={25}></AdjustButton>
        </div>
        <div className={`${styles.sidebarTitle}`}>
          <p>PREFERENCE</p>
        </div>
      </div>
      <ul className="list-unstyled ps-0">
        {data.factors.map((factor, i) => {
          return (
            <li className="mb-1" key={i}>
              <button
                className={`${styles.factor} btn btn-toggle align-items-center border-bottom collapsed pt-4`}
                data-bs-toggle="collapse"
                data-bs-target={`#${factor.name}-collapse`}
                aria-expanded="true"
              >
                <p>
                  {factor.text}
                  <span id={`${factor.name}`}>▼</span>
                </p>
              </button>
              <div
                className={`collapse ${
                  selectedFactors.includes(factor.text) ? "show" : ""
                }`}
                id={`${factor.name}-collapse`}
              >
                <ul className="btn-toggle-nav list-unstyled pb-1">
                  {factor.sub.map((sub, i) => (
                    <li key={`${sub.name}-${i}`} className="py-2">
                      <ImportanceSlider
                        sub={sub}
                        defaultValue={selectedParams[sub.param] || 0}
                        updateScores={updateScores}
                      />
                      {sub.name === "origin" && (
                        <div className="pt-3">
                          <ComboBox
                            items={sub.sub}
                            label={sub.text}
                            appendSlider={appendCountry}
                          />
                          <ul className="list-unstyled pb-2">
                            {countries.map((country, i) => (
                              <li key={`${country.name}-${i}`}>
                                <ImportanceSlider
                                  sub={country}
                                  defaultValue={ON}
                                  updateScores={updateScores}
                                  onRemove={removeCountry}
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {sub.name === "language" && (
                        <div className="pt-3">
                          <ComboBox
                            items={sub.sub}
                            label={sub.text}
                            appendSlider={appendLanguage}
                          />
                          <ul className="list-unstyled pb-2">
                            {languages.map((language, i) => (
                              <li key={`${language.name}-${i}`}>
                                <ImportanceSlider
                                  sub={language}
                                  defaultValue={ON}
                                  updateScores={updateScores}
                                  onRemove={removeLanguage}
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
