import React, { useState, useContext } from "react";

import AdjustButton from "../../components/adjustButton";
import ImportanceSlider from "../importanceSlider";
import ComboBox from "../../components/comboBox";

import AppContext from "../../contexts/AppContext";
import styles from "./preference.module.scss";

export default function Preference({
  updateScores,
  selectedParams,
  categories,
  factors,
  parameters,
  countries,
  languages,
  getParameter,
  getCategory,
  getParamText,
}) {
  const ON = 2;
  const { selectedLanguages, selectedCountries } = useContext(AppContext).data;

  const initialCountries = countries.filter((country) =>
    selectedCountries.find((c) => c === country.id)
  );
  const initialLanguages = languages.filter((language) =>
    selectedLanguages.find((l) => l === language.id)
  );

  const [countriesPref, setCountriesPref] = useState(initialCountries);
  const [languagesPref, setLanguagesPref] = useState(initialLanguages);

  const appendCountry = async (country) => {
    console.log("append country called");
    // Update Scores
    await updateScores(getParameter(country, "c").name, ON);

    const newCountriesPref = countriesPref.map((_) => _);
    if (!newCountriesPref.includes(country)) newCountriesPref.push(country);
    setCountriesPref(newCountriesPref);
  };

  const removeCountry = async (countryParam) => {
    console.log("remove country called");
    // Update Scores
    await updateScores(countryParam.name, "0");

    setCountriesPref(
      countriesPref.filter((c) => c.parameterId !== countryParam.id)
    );
  };

  const appendLanguage = async (language) => {
    // Update Scores
    console.log("append language called");
    await updateScores(getParameter(language, "l").name, ON);

    const newLanguagesPref = languagesPref.map((_) => _);
    if (!newLanguagesPref.includes(language)) newLanguagesPref.push(language);
    setLanguagesPref(newLanguagesPref);
  };

  const removeLanguage = async (languageParam) => {
    console.log("remove language called");

    // Update Scores
    await updateScores(languageParam.name, "0");

    setLanguagesPref(
      languagesPref.filter((l) => l.parameterId !== languageParam.id)
    );
  };

  const selectedCategories = Object.keys(selectedParams).map((p) => {
    const parameter = getParameter(p);
    return getCategory(parameter);
  });

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
        {categories.map((category) => {
          return (
            <li className="mb-1" key={category.id}>
              <button
                className={`${styles.factor} btn btn-toggle align-items-center border-bottom collapsed pt-4`}
                data-bs-toggle="collapse"
                data-bs-target={`#${category.name}-collapse`}
                aria-expanded="true"
              >
                <p>
                  {category.text}
                  <span id={`${category.id}`}>▼</span>
                </p>
              </button>
              <div
                className={`collapse ${
                  selectedCategories.includes(category.id) ? "show" : ""
                }`}
                id={`${category.name}-collapse`}
              >
                <ul className="btn-toggle-nav list-unstyled pb-1">
                  {factors
                    .filter((f) => f.categoryId === category.id)
                    .map((factor) => (
                      <li key={`${factor.name}-${factor.id}`} className="py-2">
                        {!["origin", "language"].includes(factor.name) && (
                          <ImportanceSlider
                            key={`${factor.name}-${factor.id}-slider`}
                            parameter={getParameter(factor, "f")}
                            defaultValue={
                              parseInt(
                                selectedParams[getParameter(factor, "f").name]
                              ) || 0
                            }
                            updateScores={updateScores}
                            getParamText={getParamText}
                          />
                        )}
                        {factor.name === "origin" && (
                          <div className="pt-3">
                            <ComboBox
                              items={countries}
                              label={factor.text}
                              appendSlider={appendCountry}
                            />
                            <ul className="list-unstyled pb-2">
                              {countriesPref.map((country) => (
                                <li key={`${country.name}-${country.id}`}>
                                  <ImportanceSlider
                                    key={`${factor.name}-${country.id}-slider`}
                                    parameter={getParameter(country, "c")}
                                    defaultValue={ON}
                                    updateScores={updateScores}
                                    onRemove={removeCountry}
                                    getParamText={getParamText}
                                  />
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {factor.name === "language" && (
                          <div className="pt-3">
                            <ComboBox
                              items={languages}
                              label={factor.text}
                              appendSlider={appendLanguage}
                            />
                            <ul className="list-unstyled pb-2">
                              {languagesPref.map((language) => (
                                <li key={`${language.name}-${language.id}`}>
                                  <ImportanceSlider
                                    key={`${factor.name}-${language.id}-slider`}
                                    parameter={getParameter(language, "l")}
                                    defaultValue={ON}
                                    updateScores={updateScores}
                                    onRemove={removeLanguage}
                                    getParamText={getParamText}
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
