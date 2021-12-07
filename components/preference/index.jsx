import React, { useState, useContext } from "react";

import AdjustButton from "../../components/adjustButton";
import ImportanceSlider from "../importanceSlider";
import ComboBox from "../../components/comboBox";

import AppContext from "../../contexts/AppContext";
import styles from "./preference.module.scss";

export default function Preference({ updateScores }) {
  // Constants
  const ON = 2;
  const { data } = useContext(AppContext);
  const {
    factors,
    selectedLanguages,
    selectedCountries,
    params,
    selectedParams,
    countries,
    languages,
  } = data;

  const initialCountries = countries.filter((country) =>
    selectedCountries.find((c) => c.name === country)
  );
  const initialLanguages = languages.filter((language) =>
    selectedLanguages.find((l) => l.name === language)
  );

  const [countriesPref, setCountriesPref] = useState(initialCountries);
  const [languagesPref, setLanguagesPref] = useState(initialLanguages);

  const selectedFactors = Object.entries(selectedParams).map(
    ([param, _]) => params[param].category_name
  );

  const appendCountry = async (country) => {
    console.log("append country called");
    // Update Scores
    await updateScores(country.param, ON);
    const newCountries = countriesPref.map((_) => _);
    if (!newCountries.includes(country)) newCountries.push(country);
    setCountriesPref(newCountries);
    console.log(country);
  };

  const removeCountry = async (country) => {
    console.log("remove country called");
    // Update Scores
    await updateScores(country.param, 0);
    setCountriesPref(countriesPref.filter((c) => c !== country));
  };

  const appendLanguage = async (language) => {
    // Update Scores
    console.log("append language called");
    await updateScores(language.param, ON);
    const newLanguages = languagesPref.map((_) => _);
    if (!newLanguages.includes(language)) newLanguages.push(language);
    setLanguagesPref(newLanguages);
  };

  const removeLanguage = async (language) => {
    console.log("remove language called");
    // Update Scores
    await updateScores(language.param, 0);
    setLanguagesPref(languagesPref.filter((l) => l !== language));
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
        {factors.map((factor, i) => {
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
                      {!["origin", "language"].includes(sub.name) && (
                        <ImportanceSlider
                          key={`${sub.name}-${i}-slider`}
                          sub={sub}
                          defaultValue={
                            parseInt(selectedParams[sub.param]) || 0
                          }
                          updateScores={updateScores}
                        />
                      )}
                      {sub.name === "origin" && (
                        <div className="pt-3">
                          <ComboBox
                            items={sub.sub}
                            label={sub.text}
                            appendSlider={appendCountry}
                          />
                          <ul className="list-unstyled pb-2">
                            {countriesPref.map((country, i) => (
                              <li key={`${country.name}-${i}`}>
                                <ImportanceSlider
                                  key={`${sub.name}-${i}-slider`}
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
                            {languagesPref.map((language, i) => (
                              <li key={`${language.name}-${i}`}>
                                <ImportanceSlider
                                  key={`${sub.name}-${i}-slider`}
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
