import Layout from "../components/layout";
import React, { useState } from "react";

const factors = [
  {
    name: "diversity",
    sub_factors: [
      { name: "cultural", param: "diversity_cultural" },
      { name: "economic", param: "diversity_economic" },
      { name: "lgbt", param: "diversity_lgbt" },
    ],
  },
  {
    name: "environment",
    sub_factors: [
      { name: "air", param: "environment_air" },
      { name: "noise", param: "environment_noise" },
      { name: "water", param: "environment_water" },
    ],
  },
  {
    name: "housing",
    sub_factors: [
      { name: "mortgage", param: "housing_mortgage" },
      { name: "rent", param: "housing_rent" },
    ],
  },
  {
    name: "immigrant",
    sub_factors: [
      {
        name: "language",
        params: {
          arabic: "immigrant_language_arabic",
          chinese: "immigrant_language_chinese",
          other: "immigrant_language_other",
          spanish: "immigrant_language_spanish",
        },
      },
      {
        name: "origin",
        params: {
          china: "immigrant_origin_china",
          india: "immigrant_origin_india",
          mexico: "immigrant_origin_mexico",
          other: "immigrant_origin_other",
        },
      },
    ],
  },
  {
    name: "opportunity",
    sub_factors: [
      { name: "employment", param: "opportunity_employment" },
      {
        name: "population",
        params: {
          high: "opportunity_population_high",
          low: "opportunity_population_low",
          medium: "opportunity_population_medium",
        },
      },
    ],
  },
  {
    name: "service",
    sub_factors: [
      { name: "banking", param: "service_banking" },
      { name: "internet", param: "service_internet" },
      { name: "library", param: "service_library" },
      { name: "medical", param: "service_medical" },
      { name: "senior", param: "service_senior" },
      { name: "transportation", param: "service_transportation" },
    ],
  },
  {
    name: "tax",
    sub_factors: [
      { name: "education", param: "tax_education" },
      { name: "other", param: "tax_other" },
      { name: "welfare", param: "tax_welfare" },
    ],
  },
  {
    name: "vote",
    sub_factors: [
      { name: "local", param: "vote_local" },
      { name: "national", param: "vote_national" },
    ],
  },
];

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

export default function Survey() {
  // Declare states
  const [queryLanguage, setQueryLanguage] = useState("");
  const [queryCountry, setQueryCountry] = useState("");
  const updateQueryLanguage = (query) => {
    setQueryLanguage(query);
  };

  const updateQueryCountry = (query) => {
    setQueryCountry(query);
  };

  const showingLanguages =
    queryLanguage === ""
      ? languages
      : languages.filter((lang) =>
          lang.name.toLowerCase().includes(queryLanguage.toLowerCase())
        );

  const showingCountries =
    queryCountry === ""
      ? countries
      : countries.filter((country) =>
          country.name.toLowerCase().includes(queryCountry.toLowerCase())
        );

  const onSubmitSurvey = async (event) => {
    event.preventDefault();

    console.log(event);

    let factors = document.querySelectorAll("input");
    input.checked
    console.log(factors);
    // let factors_checked = factors.map((factor) => {
    //   return factor;
    // });

    // const res = await fetch("/api/survey", {
    //   body: JSON.stringify({
    //     name: event.target.name.value,
    //   }),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   method: "POST",
    // });

    // const result = await res.json();
    // console.log(result);
  };

  return (
    <Layout survey>
      <div className="container">
        {/* Question Title */}
        <div className="question-title">What&apos;s important to you?</div>

        {/* Question Text */}
        <div className="question-subtitle">
          Click as many as you like.
          <br />
          You can edit and fine-tune your preferences later.
        </div>

        {/* Buttons */}
        <form className="factors">
          <div className="option-group">
            {factors.map((factor) => (
              <div key={factor.name} className="row">
                <div className="col-2">{factor.name.toUpperCase()}</div>
                {factor.sub_factors.map((sub) => {
                  const id = `toggle-${sub.name}`;
                  return (
                    <div key={id} className="col-xs-4 col-md-3 col-lg-2">
                      <input
                        type="checkbox"
                        className="btn-check"
                        name="checkbox"
                        id={id}
                        value={sub.name}
                      />
                      <label htmlFor={id} className="btn btn-toggle">
                        {sub.name.toUpperCase()}
                      </label>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <input
            className="btn btn-primary btn-survey"
            type="button"
            value="Next"
            onClick={onSubmitSurvey}
          ></input>
        </form>
      </div>

      <section className="select-language">
        <form>
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
                    name="flexRadioDefault"
                    id={id}
                  />
                  <label className="form-check-label" htmlFor={id}>
                    {lang.native}
                  </label>
                </div>
              );
            })}
            <button className="language-select">Submit</button>
          </div>
        </form>
      </section>

      <section className="select-country">
        <form>
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
                    name="flexRadioDefault"
                    id={id}
                  />
                  <label className="form-check-label" htmlFor={id}>
                    {country.name}
                  </label>
                </div>
              );
            })}
            <button className="language-select">Submit</button>
          </div>
        </form>
      </section>
    </Layout>
  );
}
