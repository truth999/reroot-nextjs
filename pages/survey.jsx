import Layout from "../components/layout";
import React, { useState } from "react";
import { useRouter } from "next/router";

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

class Step1 extends React.Component {
  render() {
    if (this.props.currentStep !== 1) {
      // Prop: The current step
      return null;
    }
    // The markup for the Step 1 UI
    return (
      <section className="select-factors">
        <div className="question-title">What&apos;s important to you?</div>
        <div className="question-subtitle">
          Click as many as you like.
          <br />
          You can edit and fine-tune your preferences later.
        </div>
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
                      name="factor"
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
      </section>
    );
  }
}
function Step2(props) {
  // Language
  const [queryLanguage, setQueryLanguage] = useState("");
  const updateQueryLanguage = (query) => {
    setQueryLanguage(query);
  };

  const showingLanguages =
    queryLanguage === ""
      ? languages
      : languages.filter((lang) =>
          lang.name.toLowerCase().includes(queryLanguage.toLowerCase())
        );

  // Country
  const [queryCountry, setQueryCountry] = useState("");

  const updateQueryCountry = (query) => {
    setQueryCountry(query);
  };

  const showingCountries =
    queryCountry === ""
      ? countries
      : countries.filter((country) =>
          country.name.toLowerCase().includes(queryCountry.toLowerCase())
        );

  if (props.currentStep !== 2) {
    // Prop: The current step
    return null;
  }

  return (
    <section className="step-2">
      {props.language && (
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
      {props.country && (
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

export default function Survey() {
  // States
  const [currentStep, setCurrentStep] = useState(1);
  const [params, setParams] = useState({
    factors: [],
    language: "",
    country: "",
  });
  const [isLastStep, setIsLastStep] = useState(false);
  const router = useRouter();

  const handleStep1 = (event) => {
    console.log("handleStep1 called");
    // Set Factors State
  };
  const handleStep2 = (event) => {
    console.log("handleStep2 called");
    // Set Factors State
  };

  const _next = () => {
    if (currentStep === 1) {
      params.factors = Array.from(
        document.querySelectorAll("input[name=factor]:checked")
      ).map((e) => e.value);
    } else {
      params.language =
        document.querySelector("input[name=language]:checked")?.value ?? "";
      params.country =
        document.querySelector("input[name=country]:checked")?.value ?? "";
    }
    setParams(params);

    let max_steps = params.factors.some((f) => f == "language" || f == "origin")
      ? 2
      : 1;
    if (currentStep === max_steps) {
      setIsLastStep(true);
    } else {
      let nextStep = currentStep + 1;
      setCurrentStep(nextStep);
    }
    console.log(params);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    router.push("/results");
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

  const nextButton = () => {
    return (
      <input
        className="btn btn-secondary btn-survey"
        type="button"
        value="Next"
        onClick={_next}
      />
    );
  };

  return (
    <Layout survey>
      <div className="container">
        Step {currentStep}
        <form onSubmit={handleSubmit}>
          <Step1
            currentStep={currentStep}
            handleChange={handleStep1}
            factors={params.factors}
          />
          <Step2
            currentStep={currentStep}
            handleChange={handleStep2}
            language={params.factors.includes("language")}
            country={params.factors.includes("origin")}
          />
          {nextButton()}
          {isLastStep && (
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          )}
        </form>
      </div>
    </Layout>
  );
}
